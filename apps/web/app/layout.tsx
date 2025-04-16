import "./styles.css"
import type { Metadata, Viewport } from "next"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import type { PropsWithChildren } from "react"
import { Toaster } from "~/components/common/toaster"
import { TooltipProvider } from "~/components/common/tooltip"
import { config } from "~/config"

export const metadata: Metadata = {
  metadataBase: new URL(config.site.url),
  title: {
    template: `%s – ${config.site.name}`,
    default: `${config.site.name} – ${config.site.tagline}`,
  },
  description: config.site.description,
  icons: {
    icon: [{ type: "image/png", url: "/favicon.png" }],
  },
  ...config.metadata,
}

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js" />
      </head>
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <NuqsAdapter>
          <TooltipProvider delayDuration={250}>{children}</TooltipProvider>
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  )
}
