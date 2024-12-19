import { isTruthy } from "@curiousleaf/utils"
import { headers } from "next/headers"
import type { AnalyzerAPIResult } from "~/lib/apis"
import { redis } from "~/services/redis"

const ANALYSIS_PREFIX = "analysis:"
const DEFAULT_LIMIT = 10

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
 * Get the cached analysis from Redis
 * @param repoUrl - The repository URL
 * @returns The cached analysis or null if there's an error
 */
export const getCachedAnalysis = async (repoUrl: string): Promise<AnalyzerAPIResult | null> => {
  try {
    const key = `analysis:${repoUrl}`
    const cached = await redis.get<AnalyzerAPIResult>(key)
    return cached
  } catch (error) {
    console.error("Cache get error:", error)
    return null
  }
}

/**
 * Get cached analysis results using Redis SCAN
 *
 * @param limit - Maximum number of results to return
 * @returns Array of analysis results
 */
export const getCachedAnalyses = async (limit = DEFAULT_LIMIT): Promise<AnalyzerAPIResult[]> => {
  const results = []
  let cursor = 0

  do {
    // Use SCAN to get keys in batches
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: `${ANALYSIS_PREFIX}*`,
      count: Math.min(limit - results.length, 10), // Get up to 10 keys per scan
    })

    cursor = Number(nextCursor)

    if (keys.length > 0) {
      // Get values for found keys
      const values = await Promise.all(keys.map(key => redis.get<AnalyzerAPIResult>(key)))

      results.push(...values.filter(isTruthy))
    }

    // Stop if we've reached the limit or no more keys
  } while (cursor !== 0 && results.length < limit)

  return results
}

/**
 * Cache the analysis in Redis
 * @param repoUrl - The repository URL
 * @param data - The analysis data
 */
export const cacheAnalysis = async (repoUrl: string, data: AnalyzerAPIResult): Promise<void> => {
  // if (!isProd) return

  try {
    const key = `analysis:${repoUrl}`
    await redis.set(key, data, { ex: 60 * 60 * 24 * 30 }) // Cache for 30 days
  } catch (error) {
    console.error("Cache set error:", error)
  }
}
