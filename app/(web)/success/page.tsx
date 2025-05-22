import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { type SearchParams, createLoader, parseAsString } from "nuqs/server"
import { cache } from "react"
import type Stripe from "stripe"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { db } from "~/services/db"
import { stripe } from "~/services/stripe"
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

const getMetadata = async (session: Stripe.Response<Stripe.Checkout.Session>) => {
  switch (session.mode) {
    case "payment": {
      if (session.metadata?.tool) {
        const tool = await db.tool.findFirst({
          where: { slug: session.metadata.tool },
          select: { name: true },
        })

        if (tool) {
          return {
            title: `Thank you for submitting ${tool.name}!`,
            description: `We've received your submission. We'll review it shortly and get back to you.`,
          }
        }
      }

      if (session.metadata?.ads) {
        return {
          title: "Thank you for advertising with us!",
          description:
            "Your advertising campaign is scheduled to run on the dates you selected. We look forward to promoting your business.",
        }
      }

      break
    }

    case "subscription": {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

      if (subscription.metadata?.tool) {
        const tool = await db.tool.findFirst({
          where: { slug: subscription.metadata.tool },
          select: { name: true },
        })

        if (tool) {
          return {
            title: "Thank you for your payment!",
            description: `We've received your payment. ${tool.name} should be featured on ${config.site.name} shortly.`,
          }
        }
      }

      if (subscription.metadata?.ads) {
        const ad = await db.ad.findFirst({
          where: { subscriptionId: subscription.id },
          select: { name: true },
        })

        if (ad) {
          return {
            title: "Thank you for advertising with us!",
            description: `Your advertising campaign should be live very shortly. We look forward to promoting ${ad.name} to our audience.`,
          }
        }
      }

      break
    }
  }

  return {
    title: "Thank you for your payment!",
    description: `We've received your payment. We really appreciate your support!`,
  }
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const session = await getCheckoutSession(props)

  return {
    ...getMetadata(session),
    alternates: { ...metadataConfig.alternates, canonical: "/success" },
    openGraph: { ...metadataConfig.openGraph, url: "/success" },
  }
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const session = await getCheckoutSession({ searchParams })
  const metadata = await getMetadata(session)

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Image
        src={"/3d-heart.webp"}
        alt=""
        width={256}
        height={228}
        className="max-w-64 w-2/3 h-auto mx-auto"
      />
    </>
  )
}
