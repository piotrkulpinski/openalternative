import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { type SearchParams, createLoader, parseAsString } from "nuqs/server"
import { cache } from "react"
import { AdDetailsForm } from "~/app/(web)/advertise/success/form"
import { AdCard } from "~/components/web/ads/ad-card"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { metadataConfig } from "~/config/metadata"
import { adOnePayload } from "~/server/web/ads/payloads"
import { db } from "~/services/db"
import { stripe } from "~/services/stripe"
import { cx } from "~/utils/cva"
import { tryCatch } from "~/utils/helpers"

type PageProps = {
  searchParams: Promise<SearchParams>
}

const getCheckoutSession = cache(async ({ searchParams }: PageProps) => {
  const searchParamsLoader = createLoader({ sessionId: parseAsString.withDefault("") })
  const { sessionId } = await searchParamsLoader(searchParams)
  const { data, error } = await tryCatch(stripe.checkout.sessions.retrieve(sessionId))

  if (error || data.status !== "complete") {
    return notFound()
  }

  return data
})

const getMetadata = async () => {
  return {
    title: "Thank you for your payment!",
    description:
      "Please complete your advertisement setup by providing your company details below.",
  }
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  return {
    ...getMetadata(),
    alternates: { ...metadataConfig.alternates, canonical: "/advertise/success" },
    openGraph: { ...metadataConfig.openGraph, url: "/advertise/success" },
  }
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const session = await getCheckoutSession({ searchParams })
  const metadata = await getMetadata()

  const existingAd = await db.ad.findFirst({
    where: { sessionId: session.id },
    select: adOnePayload,
  })

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Section>
        <Section.Content className={cx(!existingAd && "md:col-span-full")}>
          <AdDetailsForm
            sessionId={session.id}
            ad={existingAd}
            className="w-full max-w-xl mx-auto"
          />
        </Section.Content>

        {existingAd && (
          <Section.Sidebar>
            <AdCard overrideAd={existingAd} />
          </Section.Sidebar>
        )}
      </Section>
    </>
  )
}
