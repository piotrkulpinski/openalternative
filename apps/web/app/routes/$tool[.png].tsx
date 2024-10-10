import { type LoaderFunctionArgs, json } from "@remix-run/node"
import { Resvg } from "@resvg/resvg-js"
import satori from "satori"
import { ToolOpenGraph } from "~/components/opengraph/tool"
import { toolOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { SITE_URL } from "~/utils/constants"

export const loader = async ({ params: { tool: slug } }: LoaderFunctionArgs) => {
  try {
    const tool = await prisma.tool.findUniqueOrThrow({
      where: { slug, publishedAt: { lte: new Date() } },
      include: toolOnePayload,
    })

    const [fontRegular, fontBold] = await Promise.all([
      fetch(new URL("fonts/Geist-Regular.otf", SITE_URL)).then(res => res.arrayBuffer()),
      fetch(new URL("fonts/Geist-SemiBold.otf", SITE_URL)).then(res => res.arrayBuffer()),
    ])

    const svg = await satori(<ToolOpenGraph tool={tool} />, {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Geist", data: fontRegular, weight: 400, style: "normal" },
        { name: "Geist", data: fontBold, weight: 600, style: "normal" },
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
