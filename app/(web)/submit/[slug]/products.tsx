import { redirect } from "next/navigation"
import { type SearchParams, createLoader, parseAsString } from "nuqs/server"
import { Plan } from "~/components/web/plan"
import { getProductFeatures, getProducts, prepareProductsWithPrices } from "~/lib/products"
import { isToolPublished } from "~/lib/tools"
import type { ToolOne } from "~/server/web/tools/payloads"
import { countSubmittedTools } from "~/server/web/tools/queries"
import { stripe } from "~/services/stripe"

type SubmitProductsProps = {
  tool: ToolOne
  searchParams: Promise<SearchParams>
}

export const SubmitProducts = async ({ tool, searchParams }: SubmitProductsProps) => {
  const loadSearchParams = createLoader({ discountCode: parseAsString.withDefault("") })
  const { discountCode } = await loadSearchParams(searchParams)

  const [stripeProducts, stripePromo, queueLength] = await Promise.all([
    // Products
    stripe.products.list({
      active: true,
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
    countSubmittedTools({}),
  ])

  if (stripeProducts.data.length === 0) {
    // If there are no products, redirect to the success page
    redirect(`/submit/${tool.slug}/success`)
  }

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
