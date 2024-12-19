import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { env } from "~/env"

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
})

export async function isRateLimited(identifier: string): Promise<boolean> {
  try {
    const { success } = await limiter.limit(identifier)
    return !success
  } catch (error) {
    console.error("Rate limiter error:", error)
    return false
  }
}
