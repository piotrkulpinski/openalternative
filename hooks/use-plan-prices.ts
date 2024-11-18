import { useState } from "react"
import type Stripe from "stripe"

export type ProductInterval = "month" | "year"

const getPriceForInterval = (prices: Stripe.Price[], interval?: ProductInterval) => {
  if (prices.length === 0) {
    return { unit_amount: 0, id: "" } satisfies Partial<Stripe.Price>
  }

  const selectedPrice = prices.find(p => p.recurring?.interval === interval)
  return selectedPrice ?? prices[0]
}

const calculatePrices = (prices: Stripe.Price[], interval: ProductInterval) => {
  const isSubscription = prices.length > 0 && prices.some(p => p.type === "recurring")

  const currentPrice = getPriceForInterval(prices, isSubscription ? interval : undefined)
  const currentPriceValue = (currentPrice.unit_amount ?? 0) / 100
  const monthlyPrice = isSubscription ? getPriceForInterval(prices, "month") : currentPrice
  const monthlyPriceValue = (monthlyPrice.unit_amount ?? 0) / 100

  const price = isSubscription
    ? currentPriceValue / (interval === "month" ? 1 : 12)
    : currentPriceValue

  const fullPrice = isSubscription && interval === "year" ? monthlyPriceValue : null
  const discount =
    monthlyPriceValue < currentPriceValue ? Math.round((1 - price / monthlyPriceValue) * 100) : null

  return {
    isSubscription,
    currentPrice,
    price,
    fullPrice,
    discount,
  }
}

export function usePlanPrices(prices: Stripe.Price[]) {
  const [interval, setInterval] = useState<ProductInterval>("month")
  const calculatedPrices = calculatePrices(prices, interval)

  return {
    ...calculatedPrices,
    interval,
    setInterval,
  }
}
