import { adsConfig } from "~/config/ads"

/**
 * Calculates the advertising price for an item based on its monthly pageviews
 */
const calculatePrice = (pageviews: number | null) => {
  // If pageviews are null, undefined, or below minimum threshold, return null
  if (!pageviews || pageviews < adsConfig.minPageviewThreshold) {
    return null
  }

  // Pricing options
  const basePrice = 29
  const maxPrice = 199
  const stepSize = 10

  // Fixed thresholds
  const minThreshold = adsConfig.minPageviewThreshold
  const maxThreshold = 10000

  // Above maximum threshold: max price
  if (pageviews >= maxThreshold) {
    return maxPrice
  }

  // Between thresholds: calculate proportionally
  const range = maxThreshold - minThreshold
  const priceRange = maxPrice - basePrice
  const ratio = (pageviews - minThreshold) / range
  const steps = Math.floor((ratio * priceRange) / stepSize)

  return basePrice + steps * stepSize
}

/**
 * Recalculates prices for all items using fixed thresholds
 */
export const recalculatePrices = async <T extends { id: string; pageviews: number | null }>(
  items: T[],
  update: (item: T & { adPrice: number | null }) => Promise<void>,
) => {
  return await Promise.all(
    items.map(item => update({ ...item, adPrice: calculatePrice(item.pageviews) })),
  )
}
