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

const calculatePrices = (
  prices: Stripe.Price[],
  interval: ProductInterval,
  coupon?: Stripe.Coupon | null,
) => {
  const isSubscription = prices.some(p => p.type === "recurring")
  const currentPrice = getPriceForInterval(prices, isSubscription ? interval : undefined)
  const currentPriceValue = (currentPrice.unit_amount ?? 0) / 100
  const monthlyPrice = isSubscription ? getPriceForInterval(prices, "month") : currentPrice
  const monthlyPriceValue = (monthlyPrice.unit_amount ?? 0) / 100

  const initialPrice = isSubscription
    ? currentPriceValue / (interval === "month" ? 1 : 12)
    : currentPriceValue

  const couponDiscountValue = calculateCouponDiscount(initialPrice, coupon)

  const price = Math.max(0, initialPrice - couponDiscountValue)
  const fullPrice = monthlyPriceValue > price ? monthlyPriceValue : null

  const priceToDiscount = interval === "year" ? monthlyPriceValue : currentPriceValue
  const discount = calculateDiscount(priceToDiscount, price)

  return { isSubscription, currentPrice, price, fullPrice, discount }
}

const calculateCouponDiscount = (initialPrice: number, coupon?: Stripe.Coupon | null) => {
  if (!coupon) return 0
  if (coupon.percent_off) return (initialPrice * coupon.percent_off) / 100
  if (coupon.amount_off) return coupon.amount_off / 100
  return 0
}

const calculateDiscount = (basePrice: number, price: number) => {
  return basePrice > 0 ? Math.round(((basePrice - price) / basePrice) * 100) : 0
}

export function usePlanPrices(prices: Stripe.Price[], coupon?: Stripe.Coupon | null) {
  const [interval, setInterval] = useState<ProductInterval>("year")
  const calculatedPrices = calculatePrices(prices, interval, coupon)

  return {
    ...calculatedPrices,
    interval,
    setInterval,
  }
}
