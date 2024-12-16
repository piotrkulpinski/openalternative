import { addDays, differenceInMonths } from "date-fns"
import plur from "plur"
import type Stripe from "stripe"
import { config } from "~/config"

const SYMBOLS = {
  positive: "✓ ",
  neutral: "• ",
  negative: "✗ ",
} as const

type SymbolType = keyof typeof SYMBOLS

const getQueueLength = (queueLength: number) => {
  const queueDays = Math.ceil((queueLength / config.submissions.postingRate) * 7)
  const queueMonths = differenceInMonths(addDays(new Date(), queueDays), new Date())

  return `${queueMonths}+ ${plur("month", queueMonths)}`
}

const getFeatureType = (featureName?: string) => {
  return Object.keys(SYMBOLS).find(key => featureName?.startsWith(SYMBOLS[key as SymbolType])) as
    | SymbolType
    | undefined
}

const removeSymbol = (featureName?: string, type?: SymbolType) => {
  return type ? featureName?.replace(SYMBOLS[type], "") : featureName
}

/**
 * Get the products for pricing.
 *
 * @param products - The products to get for pricing.
 * @param isPublished - Whether the tool is published.
 * @returns The products for pricing.
 */
export const getProducts = (products: Stripe.Product[], isPublished: boolean) => {
  return (
    products
      // Sort by price
      .sort((a, b) => {
        const aPrice = a.default_price as Stripe.Price
        const bPrice = b.default_price as Stripe.Price
        return (aPrice.unit_amount ?? 0) - (bPrice.unit_amount ?? 0)
      })

      // Filter out expedited products if the tool is published
      .filter(product => !isPublished || !product.name.includes("Expedited"))

      // Clean up the name
      .map(({ name, ...product }) => ({ ...product, name: name.replace("Listing", "").trim() }))
  )
}

/**
 * Get the features of a product.
 *
 * @param product - The product to get the features of.
 * @param isPublished - Whether the tool is published.
 * @param queueLength - The length of the queue.
 * @returns The features of the product.
 */
export const getProductFeatures = (
  product: Stripe.Product,
  isPublished: boolean,
  queueLength: number,
) => {
  const features = product.marketing_features.filter(
    feature => !isPublished || !feature.name?.includes("processing time"),
  )

  return features.map(feature => {
    const type = getFeatureType(feature.name)
    const name = removeSymbol(feature.name, type)

    if (name?.includes("{queue}")) {
      return {
        type,
        name: name.replace("{queue}", getQueueLength(queueLength)),
        footnote: "Calculated based on the number of tools in the queue.",
      }
    }

    return { ...feature, name, type }
  })
}
