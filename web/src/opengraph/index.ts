import { Resvg } from "@resvg/resvg-js"
import satori, { type SatoriOptions } from "satori"
import toolOgImage from "~/opengraph/templates/tool"
import type { Tool } from "~/queries/tools"

const [fontRegular, fontBold] = await Promise.all([
  fetch("https://www.1001fonts.com/download/font/ibm-plex-sans.regular.ttf").then(res =>
    res.arrayBuffer(),
  ),

  fetch("https://www.1001fonts.com/download/font/ibm-plex-sans.bold.ttf").then(res =>
    res.arrayBuffer(),
  ),
])

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: "IBM Plex Sans",
      data: fontRegular,
      weight: 400,
      style: "normal",
    },
    {
      name: "IBM Plex Sans",
      data: fontBold,
      weight: 600,
      style: "normal",
    },
  ],
}

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg)
  const pngData = resvg.render()
  return pngData.asPng()
}

export async function generateOgImageForTool(tool: Tool) {
  const svg = await satori(toolOgImage(tool), options)
  return svgBufferToPngBuffer(svg)
}
