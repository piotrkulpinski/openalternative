import { type LoaderFunctionArgs, json } from "@remix-run/node"
import { Resvg } from "@resvg/resvg-js"
import { ToolOpenGraph } from "apps/web/app/components/opengraph/tool"
import { toolOnePayload } from "apps/web/app/services.server/api"
import { prisma } from "apps/web/app/services.server/prisma"
import { SITE_URL } from "apps/web/app/utils/constants"
import satori from "satori"

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const tool = await prisma.tool.findUniqueOrThrow({
      where: { slug, publishedAt: { lte: new Date() } },
      include: toolOnePayload,
    })

    const [fontRegular, fontBold] = await Promise.all([
      fetch(new URL("fonts/UncutSans-Regular.otf", SITE_URL)).then(res => res.arrayBuffer()),
      fetch(new URL("fonts/UncutSans-Semibold.otf", SITE_URL)).then(res => res.arrayBuffer()),
    ])

    const svg = await satori(<ToolOpenGraph tool={tool} />, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "UncutSans",
          data: fontRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "UncutSans",
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
  } catch (error) {
    console.log(error)
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}
