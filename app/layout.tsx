import type { Viewport } from "next"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import type { PropsWithChildren } from "react"
import { Toaster } from "~/components/common/toaster"
import { GeistSans, UncutSans } from "~/lib/fonts"

export const revalidate = 86400 // 24 hours

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={`${UncutSans.variable} ${GeistSans.variable} scroll-smooth`}>
      <body className="min-h-dvh flex flex-col bg-background text-foreground font-sans">
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </body>
    </html>
  )
}
