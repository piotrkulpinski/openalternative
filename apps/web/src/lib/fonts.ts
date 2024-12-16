import localFont from "next/font/local"
import type { FontWeight } from "satori"

export const UncutSans = localFont({
  variable: "--font-uncut-sans",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/UncutSans-Variable.woff2",
      weight: "400 900",
      style: "normal",
    },
  ],
})

export const GeistSans = localFont({
  variable: "--font-geist-sans",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/GeistSans-Variable.woff2",
      weight: "400 900",
      style: "normal",
    },
  ],
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
