import Script from "next/script"
import { type PropsWithChildren, Suspense } from "react"
import type { Graph } from "schema-dts"
import { AdBanner } from "~/components/web/ads/ad-banner"
import { Bottom } from "~/components/web/bottom"
import { Footer } from "~/components/web/footer"
import { Header } from "~/components/web/header"
import { Container } from "~/components/web/ui/container"
import { config } from "~/config"
import { env } from "~/env"

import "./styles.css"

export default function RootLayout({ children }: PropsWithChildren) {
  const url = config.site.url
  const jsonLd: Graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#/schema/organization/1`,
        name: config.site.name,
        url: `${url}/`,
        sameAs: [
          config.links.twitter,
          config.links.bluesky,
          config.links.linkedin,
          config.links.github,
        ],
        logo: {
          "@type": "ImageObject",
          "@id": `${url}/#/schema/image/1`,
          url: `${url}/favicon.png`,
          width: "480",
          height: "480",
          caption: `${config.site.name} Logo`,
        },
      },
      {
        "@type": "Person",
        "@id": `${url}/#/schema/person/1`,
        name: "Piotr Kulpinski",
        sameAs: [config.links.author],
      },
      {
        "@type": "WebSite",
        url: config.site.url,
        name: config.site.name,
        description: config.site.description,
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${url}/?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        } as any,
        isPartOf: { "@id": `${url}#/schema/website/1` },
        about: { "@id": `${url}#/schema/organization/1` },
      },
    ],
  }

  return (
    <>
      <div className="flex flex-col min-h-dvh">
        <Suspense>
          <AdBanner />
        </Suspense>

        <Header />

        <Container asChild>
          <main className="flex flex-col grow py-8 gap-8 md:gap-10 md:py-10 lg:gap-12 lg:py-12">
            {children}

            <Footer />
          </main>
        </Container>
      </div>

      <Bottom />

      {/* JSON-LD */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Plausible */}
      <Script
        defer
        data-domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
        data-api={`${env.NEXT_PUBLIC_PLAUSIBLE_HOST}/api/event`}
        src={`${env.NEXT_PUBLIC_PLAUSIBLE_HOST}/js/script.js`}
      />
    </>
  )
}
