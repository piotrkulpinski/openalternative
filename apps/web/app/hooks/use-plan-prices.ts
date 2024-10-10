import { useState } from "react"

export type ProductInterval = "month" | "year"

export type Price = {
  interval?: ProductInterval
  price: number
  priceId: string
}

const getPriceForInterval = (prices: Price[], interval?: ProductInterval) => {
  if (prices.length === 0) {
    return { price: 0, priceId: undefined, interval: undefined }
  }

  const selectedPrice = prices.find(p => p.interval === interval)
  return selectedPrice ?? prices[0]
}

const calculatePrices = (prices: Price[], interval: ProductInterval) => {
  const isSubscription = prices.length > 0 && prices.some(p => p.interval)
  const currentPrice = getPriceForInterval(prices, isSubscription ? interval : undefined)
  const monthlyPrice = isSubscription ? getPriceForInterval(prices, "month") : currentPrice

  const price = isSubscription
    ? currentPrice.price / (interval === "month" ? 100 : 1200)
    : currentPrice.price / 100

  const monthlyPriceValue = monthlyPrice.price / 100

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

export function usePlanPrices(prices: Price[]) {
  const [interval, setInterval] = useState<ProductInterval>("month")
  const calculatedPrices = calculatePrices(prices, interval)

  return {
    ...calculatedPrices,
    interval,
    setInterval,
  }
}
