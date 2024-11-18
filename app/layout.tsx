import type { Viewport } from "next"
import PlausibleProvider from "next-plausible"
import type { PropsWithChildren } from "react"
import Providers from "~/app/providers"
import { env } from "~/env"
import { GeistSans, UncutSans } from "~/lib/fonts"

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={`${UncutSans.variable} ${GeistSans.variable}`}>
      <head>
        <PlausibleProvider domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN} selfHosted />
      </head>

      <body className="min-h-dvh flex flex-col bg-background text-foreground font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
