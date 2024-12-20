"use server"

import { Ratelimit, type RatelimitConfig } from "@upstash/ratelimit"
import { headers } from "next/headers"
import { siteConfig } from "~/config/site"
import { redis } from "~/services/redis"

const rateLimitConfig: Pick<RatelimitConfig, "redis" | "analytics" | "prefix"> = {
  redis,
  analytics: true,
  prefix: `@${siteConfig.name.toLowerCase()}/ratelimit`,
}

const limiters = {
  stackAnalysis: new Ratelimit({
    ...rateLimitConfig,
    limiter: Ratelimit.slidingWindow(10, "12 h"), // 5 attempts per 12 hours
  }),
  submission: new Ratelimit({
    ...rateLimitConfig,
    limiter: Ratelimit.slidingWindow(3, "24 h"), // 3 submissions per day
  }),
  newsletter: new Ratelimit({
    ...rateLimitConfig,
    limiter: Ratelimit.slidingWindow(2, "24 h"), // 2 attempts per day
  }),
}

/**
 * Get the IP address of the client
 * @returns IP address
 */
export const getIP = async () => {
  const FALLBACK_IP_ADDRESS = "0.0.0.0"
  const headersList = await headers()
  const forwardedFor = headersList.get("x-forwarded-for")

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS
  }

  return headersList.get("x-real-ip") ?? FALLBACK_IP_ADDRESS
}

/**
 * Check if the user is rate limited
 * @param identifier - The identifier to check
 * @param action - The action to check
 * @returns True if the user is rate limited, false otherwise
 */
export const isRateLimited = async (identifier: string, action: keyof typeof limiters) => {
  try {
    const { success } = await limiters[action].limit(identifier)
    return !success
  } catch (error) {
    console.error("Rate limiter error:", error)
    return false // Fail open to prevent blocking legitimate users
  }
}
