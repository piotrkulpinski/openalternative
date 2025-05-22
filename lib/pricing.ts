/**
 * Calculates the advertising price for an item based on its monthly pageviews
 * relative to the maximum pageviews across all items.
 * Pricing ranges from $19 to $199, in $10 increments.
 */
const calculatePrice = (pageviews: number | null, maxPageviews: number) => {
  // If pageviews are null, undefined, or negative, return null
  if (!pageviews || pageviews < 50 || maxPageviews <= 0) {
    return null
  }

  // Base price starts at $29
  const basePrice = 29

  // Maximum price
  const maxPrice = 199

  // Define the step size for price increases
  const stepSize = 10

  // Calculate the ratio of current pageviews to max pageviews (0 to 1)
  const ratio = Math.min((pageviews || 0) / maxPageviews, 1)

  // Calculate how many steps to take based on the ratio
  const steps = Math.floor((ratio * (maxPrice - basePrice)) / stepSize)

  // Calculate final price by adding the appropriate number of steps
  return basePrice + steps * stepSize
}

/**
 * Recalculates prices for all items
 */
export const recalculatePrices = async <T extends { id: string; pageviews: number | null }>(
  items: T[],
  update: (item: T & { adPrice: number | null }) => Promise<void>,
) => {
  // Find the maximum pageviews
  const maxPageviews = Math.max(...items.map(({ pageviews }) => pageviews || 0).filter(Boolean), 10)

  // Update all alternatives with new prices
  await Promise.all(
    items.map(item => update({ ...item, adPrice: calculatePrice(item.pageviews, maxPageviews) })),
  )
}
