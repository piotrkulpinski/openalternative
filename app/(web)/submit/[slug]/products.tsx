import type { SearchParams } from "nuqs/server"
import { Plan } from "~/components/web/plan"
import { getProductFeatures, getProducts, prepareProductsWithPrices } from "~/lib/products"
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
  const coupon = stripePromo?.data[0]?.coupon
  const products = getProducts(stripeProducts.data, coupon, isPublished)
  const productsWithPrices = await prepareProductsWithPrices(products, coupon, stripe)

  return (
    <>
      {productsWithPrices.map(({ product, prices, isDiscounted, isFeatured }) => (
        <Plan
          key={product.id}
          isFeatured={isFeatured}
          tool={tool}
          plan={product}
          features={getProductFeatures(product, isPublished, queueLength)}
          prices={prices}
          coupon={isDiscounted ? coupon : undefined}
        />
      ))}
    </>
  )
}
