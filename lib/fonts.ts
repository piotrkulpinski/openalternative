import localFont from "next/font/local"

export const UncutSans = localFont({
  variable: "--font-uncut-sans",
  display: "swap",
  src: [
    {
      path: "../public/_static/fonts/UncutSans-Variable.woff2",
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
      path: "../public/_static/fonts/GeistSans-Variable.woff2",
      weight: "400 900",
      style: "normal",
    },
  ],
})
