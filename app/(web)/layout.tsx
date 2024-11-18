import type { Metadata } from "next"
import type { PropsWithChildren } from "react"
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
      {/* <div className="absolute inset-x-0 top-0 -z-10 max-w-screen-lg mx-auto aspect-[2/1] overflow-hidden">
        <Stars className="absolute size-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
      </div>

      <Header />

      <Container className="flex-1 flex flex-col gap-12 pb-8 pt-12 mt-[calc(var(--header-top)+var(--header-height))] md:pt-16 md:gap-16 lg:pt-20 lg:gap-20"> */}
      {children}

      {/* <Wrapper className="mt-auto">
          {false && (
            <Newsletter
              title="Subscribe to our newsletter"
              description="Stay updated with the newest additions to our digital assets library, upcoming promotions or discounts."
            />
          )}

          <hr className="relative left-1/2 w-screen -translate-x-1/2 hidden first:block" />

          <Footer />
        </Wrapper>
      </Container>

      <Toaster /> */}
    </>
  )
}
