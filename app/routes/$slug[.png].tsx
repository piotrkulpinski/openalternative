import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import { toolOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { ToolOpenGraph } from "~/components/opengraph/tool"
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { SITE_URL } from "~/utils/constants"

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const tool = await prisma.tool.findUniqueOrThrow({
      where: { slug, isDraft: false },
      include: toolOnePayload,
    })

    const [fontRegular, fontBold] = await Promise.all([
      fetch(new URL("fonts/Inter-Regular.otf", SITE_URL)).then((res) => res.arrayBuffer()),
      fetch(new URL("fonts/Inter-SemiBold.otf", SITE_URL)).then((res) => res.arrayBuffer()),
    ])

    const svg = await satori(<ToolOpenGraph tool={tool} />, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: fontBold,
          weight: 600,
          style: "normal",
        },
      ],
    })

    const resvg = new Resvg(svg)
    const pngData = resvg.render()
    const data = pngData.asPng()

    return new Response(data, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=604800, immutable",
      },
    })
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}
