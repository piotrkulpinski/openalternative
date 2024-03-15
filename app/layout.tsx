import { Container } from "@curiousleaf/design"
import dynamic from "next/dynamic"
import Script from "next/script"
import type { Metadata } from "next"
import { PostHogProvider } from "~/providers/PostHogProvider"
import { Inter } from "next/font/google"
import { PropsWithChildren } from "react"
import { Footer } from "~/components/Footer"
import { Header } from "~/components/Header"
import { config } from "~/config"
import { parseMetadata } from "~/utils/metadata"

import "~/public/globals.css"
import { env } from "~/env"

const inter = Inter({ subsets: ["latin"] })

const PostHogPageView = dynamic(() => import("~/components/PostHogPageView"), {
  ssr: false,
})

export const metadata: Metadata = {
  ...parseMetadata({ title: config.tagline }),
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="bg-gray-50">
      <PostHogProvider>
        <body className={`${inter.className} bg-zinc-50 text-black`}>
          <PostHogPageView />

          <Container size="sm" className="flex min-h-screen flex-col gap-12 md:gap-16">
            <Header />
            <main className="flex flex-col gap-8 md:gap-10 lg:gap-12">{children}</main>
            <Footer />
          </Container>

          <Script
            src="https://beamanalytics.b-cdn.net/beam.min.js"
            data-token="9313d25a-c312-4908-ae7a-8622d8f0677a"
            async
          />

          <Script
            data-name="BMC-Widget"
            data-cfasync="false"
            src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
            data-id="piotrkulpinski"
            data-description="Support me on Buy me a coffee!"
            data-message=""
            data-color="#FF6154"
            data-position="Right"
            data-x_margin="18"
            data-y_margin="18"
          />

          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-8KPPXJCSJY" />
          <Script id="google-analytics">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${env.NEXT_PUBLIC_GA_KEY}');
            `}
          </Script>
        </body>
      </PostHogProvider>
    </html>
  )
}
