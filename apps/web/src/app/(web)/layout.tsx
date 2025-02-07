import Script from "next/script"
import type { PropsWithChildren } from "react"
import Providers from "~/app/(web)/providers"
import { Footer } from "~/components/web/footer"
import { Container } from "~/components/web/ui/container"
import { env } from "~/env"

import "./styles.css"

export const revalidate = 86400 // One day

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      <div className="flex flex-col min-h-dvh">
        {/* <Suspense>
          <AdBanner />
        </Suspense>

        <Header /> */}

        <Container asChild>
          <main className="flex flex-col grow py-8 gap-8 md:gap-10 md:py-10 lg:gap-12 lg:py-12">
            {children}

            <Footer />
          </main>
        </Container>
      </div>

      {/* <Bottom /> */}

      <Script
        defer
        data-domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
        data-api={env.NEXT_PUBLIC_PLAUSIBLE_API_URL}
        src={env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL}
      />
    </Providers>
  )
}
