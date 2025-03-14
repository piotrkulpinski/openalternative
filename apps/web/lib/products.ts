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

export const getQueueLength = (queueLength: number) => {
  const queueDays = Math.ceil((queueLength / config.submissions.postingRate) * 7)
  const queueMonths = Math.max(differenceInMonths(addDays(new Date(), queueDays), new Date()), 1)

  return `${queueMonths} ${plur("month", queueMonths)}`
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
export const getProducts = (
  products: Stripe.Product[],
  coupon: Stripe.Coupon | undefined,
  isPublished: boolean,
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

      // Filter out products that are not eligible for the coupon
      .filter(product => isProductDiscounted(product.id, coupon) || product.name.includes("Free"))

      // Clean up the name
      .map(({ name, ...product }) => ({ ...product, name: name.replace("Listing", "").trim() }))
  )
}

/**
 * Determine if a product should be featured in the UI.
 *
 * @param index - The index of the product in the list.
 * @param products - The list of all products.
 * @param coupon - The coupon being applied, if any.
 * @param isDiscounted - Whether the product is eligible for a discount.
 * @returns Whether the product should be featured.
 */
export const isProductFeatured = (
  index: number,
  products: Stripe.Product[],
  coupon?: Stripe.Coupon,
  isDiscounted = true,
) => {
  if (!coupon) return index === products.length - 1

  const lastDiscountedIndex = getLastDiscountedProductIndex(products, coupon)
  return isDiscounted && index === lastDiscountedIndex
}

/**
 * Check if a product is eligible for a discount with the given coupon.
 *
 * @param productId - The ID of the product to check.
 * @param coupon - The coupon to check against.
 * @returns Whether the product is eligible for the discount.
 */
export const isProductDiscounted = (productId: string, coupon?: Stripe.Coupon) => {
  return !coupon?.applies_to || coupon.applies_to.products.includes(productId)
}

/**
 * Find the index of the last discounted product in a list of products.
 *
 * @param products - The list of products to check.
 * @param coupon - The coupon to check against.
 * @returns The index of the last discounted product, or -1 if none are discounted.
 */
export const getLastDiscountedProductIndex = (
  products: Stripe.Product[],
  coupon?: Stripe.Coupon,
) => {
  return products.reduce(
    (lastIdx, product, idx) => (isProductDiscounted(product.id, coupon) ? idx : lastIdx),
    -1,
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

/**
 * Fetch prices for a list of products and prepare them for display.
 *
 * @param products - The list of products to prepare.
 * @param coupon - The coupon being applied, if any.
 * @param stripe - The Stripe instance to use for fetching prices.
 * @returns A promise that resolves to an array of products with their prices and discount status.
 */
export const prepareProductsWithPrices = async (
  products: Stripe.Product[],
  coupon?: Stripe.Coupon,
  stripe?: Stripe,
) => {
  if (!stripe) throw new Error("Stripe instance is required")

  return Promise.all(
    products.map(async (product, index) => {
      const prices = await stripe.prices.list({ product: product.id, active: true })
      const isDiscounted = isProductDiscounted(product.id, coupon)

      return {
        product,
        prices: prices.data,
        isDiscounted,
        isFeatured: isProductFeatured(index, products, coupon, isDiscounted),
      }
    }),
  )
}
