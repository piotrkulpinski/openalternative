import type { Metadata } from "next"
import { type PropsWithChildren, Suspense } from "react"
import { AdBanner } from "~/components/web/ads/ad-banner"
import { Bottom } from "~/components/web/bottom"
import { Footer } from "~/components/web/footer"
import { Header } from "~/components/web/header"
import { Container } from "~/components/web/ui/container"
import { config } from "~/config"
import { parseMetadata } from "~/utils/metadata"

import "./styles.css"

export const metadata: Metadata = {
  metadataBase: new URL(config.site.url),
  ...parseMetadata({}),
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <div className="flex flex-col min-h-dvh">
        <AdBanner />
        <Header />

        <Container asChild>
          <main className="flex flex-col grow py-8 gap-8 md:gap-10 md:py-10 lg:gap-12 lg:py-12">
            {children}

            <Footer />
          </main>
        </Container>
      </div>

      <Suspense>
        <Bottom />
      </Suspense>
    </>
  )
}
