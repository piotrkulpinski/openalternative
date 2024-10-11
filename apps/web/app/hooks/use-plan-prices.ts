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
  const isSubscription = prices.length > 0 && prices.some(p => p.recurring?.interval)
  const currentPrice = getPriceForInterval(prices, isSubscription ? interval : undefined)
  const monthlyPrice = isSubscription ? getPriceForInterval(prices, "month") : currentPrice

  const price = isSubscription
    ? (currentPrice.unit_amount ?? 0) / (interval === "month" ? 100 : 1200)
    : (currentPrice.unit_amount ?? 0) / 100

  const monthlyPriceValue = (monthlyPrice.unit_amount ?? 0) / 100

  const fullPrice = isSubscription && interval === "year" ? monthlyPriceValue : null
  const discount =
    isSubscription && interval === "year" ? Math.round((1 - price / monthlyPriceValue) * 100) : null

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
