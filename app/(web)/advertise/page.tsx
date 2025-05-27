import type { Metadata } from "next/types"
import { type SearchParams, createLoader, parseAsString } from "nuqs/server"
import { AdvertisePickers } from "~/app/(web)/advertise/pickers"
import { Button } from "~/components/common/button"
import { Advertisers } from "~/components/web/advertisers"
import { ExternalLink } from "~/components/web/external-link"
import { Stats } from "~/components/web/stats"
import { Testimonial } from "~/components/web/testimonial"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { siteConfig } from "~/config/site"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: `Advertise on ${siteConfig.name}`,
  description: `Promote your business or software on ${siteConfig.name} and reach a wide audience of open source enthusiasts.`,
  openGraph: { ...metadataConfig.openGraph, url: "/advertise" },
  alternates: { ...metadataConfig.alternates, canonical: "/advertise" },
}

export default async function AdvertisePage({ searchParams }: PageProps) {
  const searchParamsLoader = createLoader({ alternative: parseAsString })
  const { alternative } = await searchParamsLoader(searchParams)

  return (
    <div className="flex flex-col gap-12 md:gap-14 lg:gap-16">
      <Intro alignment="center">
        <IntroTitle>{`${metadata.title}`}</IntroTitle>

        <IntroDescription className="max-w-3xl">
          Promote your business or software and reach a wide audience of open source enthusiasts.
          Check our{" "}
          <a href={config.links.analytics} target="_blank" rel="noopener noreferrer nofollow">
            real-time analytics
          </a>{" "}
          to see what impact it could have on your business.
        </IntroDescription>
      </Intro>

      <AdvertisePickers alternative={alternative} />

      <Stats />

      {config.ads.testimonials.map(testimonial => (
        <Testimonial key={testimonial.quote} {...testimonial} />
      ))}

      <Advertisers />

      <hr />

      <Intro alignment="center">
        <IntroTitle size="h2" as="h3">
          Need a custom partnership?
        </IntroTitle>

        <IntroDescription className="max-w-lg">
          Tell us more about your company and we will get back to you as soon as possible.
        </IntroDescription>

        <Button className="mt-4 min-w-40" asChild>
          <ExternalLink href={`mailto:${config.site.email}`}>Contact us</ExternalLink>
        </Button>
      </Intro>
    </div>
  )
}
