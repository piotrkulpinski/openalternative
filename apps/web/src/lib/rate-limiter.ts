import { Ratelimit, type RatelimitConfig } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { siteConfig } from "~/config/site"
import { env } from "~/env"

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

const rateLimitConfig: Pick<RatelimitConfig, "redis" | "analytics" | "prefix"> = {
  redis,
  analytics: true,
  prefix: `@${siteConfig.name.toLowerCase()}/ratelimit`,
}

// Different limiters for different actions
export const limiters = {
  stackAnalysis: new Ratelimit({
    ...rateLimitConfig,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
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

export const isRateLimited = async (identifier: string, action: keyof typeof limiters) => {
  try {
    const { success } = await limiters[action].limit(identifier)
    return !success
  } catch (error) {
    console.error("Rate limiter error:", error)
    return false // Fail open to prevent blocking legitimate users
  }
}
