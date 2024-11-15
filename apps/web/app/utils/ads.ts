import { addMonths, eachDayOfInterval, endOfMonth, isAfter, isBefore, startOfMonth } from "date-fns"
import type { DateRange } from "react-day-picker"
import { DAY_IN_MS } from "./constants"

type PricingItem = {
  price: number
  duration?: number
}

/**
 * Calculate the ads price based on the duration
 * @param selections - An array of { price, duration } objects
 * @param basePrice - The base price of the ads
 * @returns The price, full price, discount amount, discount percentage, and duration
 */
export const calculateAdsPrice = (selections: PricingItem[], basePrice: number) => {
  // Calculate raw total before discounts
  const totalPrice = selections.reduce(
    (sum, { price, duration }) => sum + price * (duration || 0),
    0,
  )

  // Convert total value to equivalent days at base price
  const equivalentDays = Math.round(totalPrice / basePrice)

  // Apply volume discount (max 30%)
  const discountPercentage = Math.min(
    Math.max(equivalentDays - 1, 0), // Ensure non-negative
    30, // Cap at 30%
  )

  // Calculate final price with discount
  const discountedPrice = Number((totalPrice * (1 - discountPercentage / 100)).toFixed(2))

  return {
    totalPrice,
    discountedPrice,
    discountPercentage,
  }
}

/**
 * Adjust the ads duration based on the excluded date ranges
 * @param duration - The original duration
 * @param startDate - The start date of the ads
 * @param endDate - The end date of the ads
 * @param excludeRange - An array of date ranges to exclude
 * @returns The adjusted duration
 */
export const adjustAdsDuration = (
  duration: number,
  startDate: Date,
  endDate: Date,
  excludeRange: DateRange[],
) => {
  let adjustedDuration = duration

  for (const { from, to } of excludeRange) {
    if (!from || !to) continue

    const start = from.getTime()
    const end = to.getTime()

    for (let d = start; d <= end; d += DAY_IN_MS) {
      const currentDate = new Date(d)

      if (currentDate >= startDate && currentDate <= endDate) {
        adjustedDuration--
      }
    }
  }

  return adjustedDuration
}

/**
 * Get the first available month for ads
 * @param dates - An array of date ranges to exclude
 * @returns The first available month
 */
export const getFirstAvailableMonth = (dates: { from: Date; to: Date }[]) => {
  let today = startOfMonth(new Date())

  function isDateDisabled(date: Date) {
    if (isBefore(date, today)) return true

    return dates.some(({ from, to }) => {
      return !isAfter(date, to) && !isBefore(date, from)
    })
  }

  function monthHasAvailableDay(date: Date) {
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(date),
      end: endOfMonth(date),
    })

    return daysInMonth.some(day => !isDateDisabled(day))
  }

  while (!monthHasAvailableDay(today)) {
    today = addMonths(today, 1)
  }

  return today
}
