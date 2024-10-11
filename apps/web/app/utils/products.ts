import { addDays, differenceInMonths } from "date-fns"
import plur from "plur"
import type Stripe from "stripe"
import { SUBMISSION_POSTING_RATE } from "~/utils/constants"

const SYMBOLS = {
  positive: "✓ ",
  neutral: "• ",
  negative: "✗ ",
} as const

type SymbolType = keyof typeof SYMBOLS

const getQueueLength = (queueLength: number) => {
  const queueDays = Math.ceil((queueLength / SUBMISSION_POSTING_RATE) * 7)
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

export const getProductsForPricing = (
  products: Stripe.Product[],
  isPublished: boolean,
  queueLength: number,
) => {
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

      // Map to features
      .map(({ name, ...product }) => {
        let features = product.marketing_features.filter(
          feature => !isPublished || !feature.name?.includes("processing time"),
        )

        features = features.map(feature => {
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

        return { ...product, name: name.replace("Listing", "").trim(), features }
      })
  )
}
