import type { Metadata } from "next"
import Link from "next/link"
import { AdsPicker } from "~/components/web/ads-picker"
import { Advertisers } from "~/components/web/advertisers"
import { Stats } from "~/components/web/stats"
import { Testimonial } from "~/components/web/testimonial"
import { Button } from "~/components/web/ui/button"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { findAds } from "~/server/web/ads/queries"

export const metadata: Metadata = {
  title: `Advertise on ${config.site.name}`,
  description: `Promote your business or software on ${config.site.name} and reach a wide audience of open source enthusiasts.`,
  openGraph: { ...metadataConfig.openGraph, url: "/advertise" },
  alternates: { ...metadataConfig.alternates, canonical: "/advertise" },
}

export default async function AdvertisePage() {
  const ads = await findAds({})

  return (
    <>
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

      <AdsPicker ads={ads} className="w-full max-w-2xl mx-auto" />

      <Stats className="my-4" />

      {config.ads.testimonials.map(testimonial => (
        <Testimonial key={testimonial.quote} {...testimonial} className="my-4" />
      ))}

      <div className="flex flex-col items-center text-center gap-6 mt-4" id="advertisers">
        <p className="text-sm text-muted">
          Join these companies in advertising their business on {config.site.name}
        </p>

        <Advertisers />
      </div>

      <hr />

      <Intro alignment="center" className="md:my-4 lg:my-8">
        <IntroTitle size="h2" as="h3">
          Interested in Advertising?
        </IntroTitle>

        <IntroDescription className="max-w-lg">
          Tell us more about your company and we will get back to you as soon as possible.
        </IntroDescription>

        <Button variant="fancy" className="mt-4 min-w-40" asChild>
          <Link href={`mailto:${config.site.email}`} target="_blank" rel="noopener noreferrer">
            Contact us
          </Link>
        </Button>
      </Intro>
    </>
  )
}
