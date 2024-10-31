import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { Plan } from "~/components/plan"
import { BackButton } from "~/components/ui/back-button"
import { Badge } from "~/components/ui/badge"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { BrandStripeIcon } from "~/components/ui/icons/brand-stripe"
import { Intro, IntroTitle } from "~/components/ui/intro"
import { Prose } from "~/components/ui/prose"
import { Stack } from "~/components/ui/stack"
import { type ToolOne, toolOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { stripe } from "~/services.server/stripe"
import { JSON_HEADERS, SITE_EMAIL } from "~/utils/constants"
import { type GetMetaTagsProps, getMetaTags } from "~/utils/meta"
import { getProductsForPricing } from "~/utils/products"
import { isToolPublished } from "~/utils/tools"

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
  let meta: Partial<GetMetaTagsProps> = {}

  try {
    const [tool, queueLength, stripeProducts] = await Promise.all([
      prisma.tool.findUniqueOrThrow({
        where: { slug, isFeatured: false },
        include: toolOnePayload,
      }),

      prisma.tool.count({
        where: { OR: [{ publishedAt: { gt: new Date() } }, { publishedAt: null }] },
      }),

      stripe.products.list({
        active: true,
        ids: process.env.STRIPE_PRODUCT_IDS?.split(",").map(e => e.trim()),
        expand: ["data.default_price"],
      }),
    ])

    const isPublished = isToolPublished(tool)
    const products = getProductsForPricing(stripeProducts.data, isPublished, queueLength)

    // Meta tags
    if (isPublished) {
      meta = {
        title: `Boost ${tool.name}'s Visibility`,
        description: `Choose a featured package to increase ${tool.name}'s presence, attract more users, and stand out from the competition. Benefit from a homepage spot, a prominent placement, and a do-follow link.`,
      }
    } else {
      meta = {
        title: "Choose a submission package",
        description: `Maximize ${tool.name}'s impact from day one. Select a package that suits your goals - from free listing to premium features.`,
      }
    }

    return json({ tool, products, meta }, { headers: { ...JSON_HEADERS } })
  } catch (error) {
    console.error(error)
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function SubmitPagePackage() {
  const { products, meta } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro alignment="center" {...meta} />

      <div className="flex flex-wrap justify-center gap-6">
        {products.map((plan, index) => (
          <Plan key={plan.id} isFeatured={index === 1} plan={plan} />
        ))}

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
