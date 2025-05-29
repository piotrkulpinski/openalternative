import { Geist } from "next/font/google"
import localFont from "next/font/local"
import type { FontWeight } from "satori"

export const fontSans = Geist({
  variable: "--font-sans",
  display: "swap",
  subsets: ["latin"],
  weight: "variable",
})

export const fontDisplay = localFont({
  variable: "--font-display",
  display: "swap",
  src: [{ path: "../public/fonts/ABCDiatype-Bold.woff2", weight: "700", style: "normal" }],
})

export const loadGoogleFont = async (font: string, weight: FontWeight) => {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (resource) {
    const response = await fetch(resource[1])
    if (response.status === 200) {
      return await response.arrayBuffer()
    }
  }

  throw new Error("failed to load font data")
}
