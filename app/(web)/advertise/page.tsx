import { Slot } from "@radix-ui/react-slot"
import { LightbulbIcon, MegaphoneIcon, SendIcon, SquareAsteriskIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { cache } from "react"
import { H4 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { AdsPicker } from "~/components/web/ads-picker"
import { Advertisers } from "~/components/web/advertisers"
import { Stats } from "~/components/web/stats"
import { Button } from "~/components/web/ui/button"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { findAds } from "~/server/ads/queries"
import { parseMetadata } from "~/utils/metadata"

const getMetadata = cache(
  (metadata?: Metadata): Metadata => ({
    ...metadata,
    title: `Advertise on ${config.site.name}`,
    description: `Promote your business or software on ${config.site.name} and reach a wide audience of open source enthusiasts.`,
  }),
)

export const metadata = parseMetadata(
  getMetadata({
    alternates: { canonical: "/advertise" },
    openGraph: { url: "/advertise" },
  }),
)

export default async function AdvertisePage() {
  const ads = await findAds({})
  const { title } = getMetadata()

  const options = [
    {
      icon: <SquareAsteriskIcon />,
      title: "Featured Listings",
      description:
        "Get a prominent listing on our homepage, alternative rankings and categories. Available only for open source projects listed on our site.",
    },
    {
      icon: <MegaphoneIcon />,
      title: "Advertising Banners",
      description:
        "We offer a variety of banner ads that you can display on your website to reach our audience. You can choose where to display them.",
    },
    {
      icon: <SendIcon />,
      title: "Newsletter Sponsorship",
      description:
        "Get featured in our monthly newsletter read by tech enthusiasts. Include a personalized message to our audience with your link.",
    },
    {
      icon: <LightbulbIcon />,
      title: "Custom Marketing Plan",
      description:
        "If none of the options discussed align with your marketing strategies, please send us an email so we can discuss your specific needs.",
    },
  ]

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>{title?.toString()}</IntroTitle>

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

      <Intro alignment="center" className="mt-8">
        <IntroTitle size="h2" as="h2">
          Advertising Options
        </IntroTitle>

        <IntroDescription className="mt-2">
          We only accept advertisements promoting services and products that are relevant to open
          source. They should cover informational topics or provide incentives that benefit our
          visitors.
        </IntroDescription>
      </Intro>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {options.map(option => (
          <div
            key={option.title}
            className="flex flex-col items-center gap-4 border rounded-xl px-4 py-6 text-center"
          >
            <Stack size="sm">
              <Slot className="size-6 stroke-[1.5] text-muted">{option.icon}</Slot>

              <H4 as="strong">{option.title}</H4>
            </Stack>

            <p className="max-w-sm text-secondary">{option.description}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center text-center gap-6 mt-4" id="advertisers">
        <p className="text-sm text-muted">
          Join these companies in advertising their business on {config.site.name}
        </p>

        <Advertisers />
      </div>

      <hr />

      <Intro alignment="center" className="md:my-4 lg:my-8">
        <IntroTitle as="h2">Interested in Advertising?</IntroTitle>

        <IntroDescription className="max-w-lg">
          Tell us more about your company and we will get back to you as soon as possible.
        </IntroDescription>

        <Button variant="fancy" className="mt-4 min-w-40 !text-base" asChild>
          <Link href={`mailto:${config.site.email}`} target="_blank" rel="noopener noreferrer">
            Contact us
          </Link>
        </Button>
      </Intro>
    </>
  )
}
