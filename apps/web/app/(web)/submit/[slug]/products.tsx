import type { SearchParams } from "nuqs/server"
import { Plan } from "~/components/web/plan"
import { getProductFeatures, getProducts } from "~/lib/products"
import { isToolPublished } from "~/lib/tools"
import type { ToolOne } from "~/server/web/tools/payloads"
import { countUpcomingTools } from "~/server/web/tools/queries"
import { stripe } from "~/services/stripe"

type SubmitProductsProps = {
  tool: ToolOne
  searchParams: Promise<SearchParams>
}

export const SubmitProducts = async ({ tool, searchParams }: SubmitProductsProps) => {
  const { discountCode } = await searchParams

  const [stripeProducts, stripePromo, queueLength] = await Promise.all([
    // Products
    stripe.products.list({
      active: true,
      ids: process.env.STRIPE_PRODUCT_IDS?.split(",").map(e => e.trim()),
      expand: ["data.default_price"],
    }),

    // Promotion code
    discountCode
      ? stripe.promotionCodes.list({
          code: String(discountCode),
          limit: 1,
          active: true,
          expand: ["data.coupon.applies_to"],
        })
      : undefined,

    // Queue length
    countUpcomingTools({}),
  ])

  const isPublished = isToolPublished(tool)
  const products = getProducts(stripeProducts.data, isPublished)
  const coupon = stripePromo?.data[0]?.coupon

  return (
    <>
      {products.map(async (plan, index) => {
        const isDiscounted = coupon?.applies_to?.products?.includes(plan.id)

        const prices = await stripe.prices.list({
          product: plan.id,
          active: true,
        })

        return (
          <Plan
            key={plan.id}
            isFeatured={coupon ? isDiscounted : index === products.length - 1}
            tool={tool}
            plan={plan}
            features={getProductFeatures(plan, isPublished, queueLength)}
            prices={prices.data}
            coupon={isDiscounted ? coupon : undefined}
          />
        )
      })}
    </>
  )
}
