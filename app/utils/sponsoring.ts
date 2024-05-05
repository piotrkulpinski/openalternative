import type { DateRange } from "react-day-picker"
import { BASE_SPONSORING_PRICE, DAY_IN_MS } from "./constants"

export const calculateSponsoringPrice = (days: number) => {
  const discountPercentage = Math.min(days * 1, 30)
  const price = Math.round(BASE_SPONSORING_PRICE * (1 - discountPercentage / 100) * 100) / 100
  const fullPrice = Math.round(price * days * 100) / 100
  const discountAmount = BASE_SPONSORING_PRICE * days - fullPrice

  return { price, fullPrice, discountAmount, discountPercentage, days }
}

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
