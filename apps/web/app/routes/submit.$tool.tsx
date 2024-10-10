import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { addDays, differenceInMonths } from "date-fns"
import plur from "plur"
import { Plan, type PlanProps } from "~/components/plan"
import { BackButton } from "~/components/ui/back-button"
import { Badge } from "~/components/ui/badge"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { BrandStripeIcon } from "~/components/ui/icons/brand-stripe"
import { Intro, IntroTitle } from "~/components/ui/intro"
import { Prose } from "~/components/ui/prose"
import { Stack } from "~/components/ui/stack"
import { type ToolOne, toolOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS, SITE_EMAIL, SITE_NAME, SUBMISSION_POSTING_RATE } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: (data?: { tool: ToolOne }) => {
    if (!data?.tool) return <BackButton to="/submit" />

    const { slug, name } = data.tool

    return <BreadcrumbsLink to={`/submit/${slug}`} label={name} />
  },
}

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async ({ params: { tool: slug } }: LoaderFunctionArgs) => {
  try {
    const [tool, unpublishedToolCount] = await Promise.all([
      prisma.tool.findUniqueOrThrow({
        where: { slug, isFeatured: false },
        include: toolOnePayload,
      }),

      prisma.tool.count({
        where: { OR: [{ publishedAt: { gt: new Date() } }, { publishedAt: null }] },
      }),
    ])

    const isPublished = tool.publishedAt && tool.publishedAt <= new Date()
    const queueDays = Math.ceil((unpublishedToolCount / SUBMISSION_POSTING_RATE) * 7)
    const queueMonths = differenceInMonths(addDays(new Date(), queueDays), new Date())

    const meta = {
      title: isPublished ? `Boost ${tool.name}'s Visibility` : `Choose a package for ${tool.name}`,
      description: isPublished
        ? `Elevate ${tool.name}'s presence on ${SITE_NAME}. Choose a featured package to increase visibility, attract more users, and stand out from the competition. Benefit from premium placement, a featured badge, and a do-follow link.`
        : `Maximize ${tool.name}'s impact from day one. Select a package that suits your goals - from free listings to premium features. Expedite your launch, gain visibility, and start connecting with your target audience faster.`,
    }

    return json({ tool, queueMonths, isPublished, meta }, { headers: { ...JSON_HEADERS } })
  } catch (error) {
    console.error(error)
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {}

export default function SubmitPagePackage() {
  const { tool, queueMonths, isPublished, meta } = useLoaderData<typeof loader>()

  const plans = [
    {
      name: "Free",
      description: "Free listing with a basic description and a link to your website.",
      prices: [],
      features: [
        {
          text: `${queueMonths}+ ${plur("month", queueMonths)} processing time`,
          type: "neutral",
          footnote: "Calculated based on the number of tools in the queue.",
        },
        { text: "Link to your website", type: "neutral" },
        { text: "No content updates", type: "negative" },
        { text: "No featured spot", type: "negative" },
        { text: "No featured badge", type: "negative" },
      ],
      buttonProps: {
        variant: "secondary",
        disabled: true,
        children: "Current package",
      },
    },
    {
      isHidden: !!isPublished,
      name: "Standard",
      description: "Skip the queue and get your site published on the site within 24 hours.",
      prices: [{ price: 9700, priceId: "price_1Q7CtHDUyMoajCx1CWZch7qn" }],
      features: [
        { text: "24h processing time", type: "positive" },
        { text: "Unlimited content updates", type: "positive" },
        { text: "Do-follow link to your website", type: "negative" },
        { text: "No featured spot", type: "negative" },
        { text: "No featured badge", type: "negative" },
      ],
      isFeatured: true,
      buttonProps: {
        variant: "primary",
        children: "Expedite Listing",
      },
    },
    {
      name: "Featured",
      description: "Featured listing with a homepage spot and a featured badge.",
      prices: [
        { interval: "month", price: 19700, priceId: "price_1Q7CwiDUyMoajCx14a53vJJF" },
        { interval: "year", price: 197000, priceId: "price_1Q7CwiDUyMoajCx1M48a1Fv4" },
      ],
      features: [
        { text: "12h processing time", type: "positive" },
        { text: "Unlimited content updates", type: "positive" },
        { text: "Do-follow link to your website", type: "positive" },
        { text: "Featured spot on homepage", type: "positive" },
        { text: "Featured badge", type: "positive" },
      ],
      isFeatured: !!isPublished,
      buttonProps: {
        variant: "primary",
        children: tool.publishedAt ? "Upgrade to Featured" : "List as Featured",
      },
    },
  ] satisfies PlanProps[]

  return (
    <>
      <Intro alignment="center" {...meta} />

      <div className="flex flex-wrap justify-center gap-6">
        {plans.map(({ features, ...plan }) => {
          if (isPublished) {
            features.shift()
          }

          return <Plan key={plan.name} features={features} {...plan} />
        })}

        <Stack size="xs" className="place-content-center w-full -mt-2">
          <p className="text-xs text-muted">Payments secured by</p>

          <Badge variant="outline" prefix={<BrandStripeIcon className="rounded-sm" />}>
            Stripe
          </Badge>
        </Stack>
      </div>

      <Intro alignment="center">
        <IntroTitle size="h3">Have questions?</IntroTitle>

        <Prose>
          <p>
            If you have any questions, please contact us at{" "}
            <Link to={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</Link>.
          </p>
        </Prose>
      </Intro>
    </>
  )
}
