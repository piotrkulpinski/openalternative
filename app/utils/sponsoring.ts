import type { DateRange } from "react-day-picker"
import { BASE_SPONSORING_PRICE, DAY_IN_MS } from "./constants"

/**
 * Calculate the sponsoring price based on the duration
 * @param days - The duration of the sponsoring in days
 * @returns The price, full price, discount amount, discount percentage, and duration
 */
export const calculateSponsoringPrice = (days: number) => {
  const discountPercentage = Math.min(days - 1, 30)
  const price = Math.round(BASE_SPONSORING_PRICE * (1 - discountPercentage / 100) * 100) / 100
  const fullPrice = Math.round(price * days * 100) / 100
  const discountAmount = BASE_SPONSORING_PRICE * days - fullPrice

  return { price, fullPrice, discountAmount, discountPercentage, days }
}

/**
 * Adjust the sponsoring duration based on the excluded date ranges
 * @param duration - The original duration
 * @param startDate - The start date of the sponsoring
 * @param endDate - The end date of the sponsoring
 * @param excludeRange - An array of date ranges to exclude
 * @returns The adjusted duration
 */
export const adjustSponsoringDuration = (
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
 * Get the first available month for sponsoring
 * @param dates - An array of date ranges to exclude
 * @returns The first available month
 */
export const getFirstAvailableMonth = (dates: { from: Date; to: Date }[]): Date => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isDateDisabled = (date: Date): boolean => {
    if (date <= today) return true
    return dates.some(range => {
      const fromDate = new Date(range.from)
      fromDate.setHours(0, 0, 0, 0)
      const toDate = range.to ? new Date(range.to) : new Date(range.from)
      toDate.setHours(23, 59, 59, 999)
      return date >= fromDate && date <= toDate
    })
  }

  const monthHasAvailableDay = (year: number, month: number): boolean => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => i + 1).some(
      day => !isDateDisabled(new Date(year, month, day)),
    )
  }

  let currentDate = new Date(today)
  currentDate.setDate(1)

  while (true) {
    if (monthHasAvailableDay(currentDate.getFullYear(), currentDate.getMonth())) {
      return currentDate
    }
    currentDate.setMonth(currentDate.getMonth() + 1)
  }
}
