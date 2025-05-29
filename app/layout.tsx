import "./styles.css"
import type { Metadata, Viewport } from "next"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import type { PropsWithChildren } from "react"
import { Search } from "~/components/common/search"
import { Toaster } from "~/components/common/toaster"
import { TooltipProvider } from "~/components/common/tooltip"
import { config } from "~/config"
import { SearchProvider } from "~/contexts/search-context"
import { fontDisplay, fontSans } from "~/lib/fonts"

export const metadata: Metadata = {
  metadataBase: new URL(config.site.url),
  title: {
    template: "%s",
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
    <html
      lang="en"
      className={`${fontSans.variable} ${fontDisplay.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <NuqsAdapter>
          <TooltipProvider delayDuration={250}>
            <SearchProvider>
              {children}
              <Toaster />
              <Search />
            </SearchProvider>
          </TooltipProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
