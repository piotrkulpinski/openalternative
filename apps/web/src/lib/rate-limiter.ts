import type { AllowedKeys } from "@specfy/stack-analyser"
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

export async function getCachedAnalysis(repoUrl: string): Promise<AllowedKeys[] | null> {
  try {
    const key = `analysis:${repoUrl}`
    const cached = await redis.get<AllowedKeys[]>(key)
    return cached
  } catch (error) {
    console.error("Cache get error:", error)
    return null
  }
}

export async function cacheAnalysis(repoUrl: string, data: AllowedKeys[]): Promise<void> {
  try {
    const key = `analysis:${repoUrl}`
    await redis.set(key, data, { ex: 60 * 60 * 24 * 30 }) // Cache for 30 days
  } catch (error) {
    console.error("Cache set error:", error)
  }
}
