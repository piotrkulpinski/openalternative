import { isTruthy } from "@curiousleaf/utils"
import { getRepositoryString } from "@openalternative/github"
import { type AnalyzerAPIResult, analyzerApi } from "~/lib/apis"
import { redis } from "~/services/redis"
import { tryCatch } from "~/utils/helpers"

const ANALYSIS_PREFIX = "analysis:"
const DEFAULT_LIMIT = 10

/**
 * Get the cached analysis from Redis
 * @param repoUrl - The repository URL
 * @returns The cached analysis or null if there's an error
 */
export const getCachedAnalysis = async (repoUrl: string) => {
  const key = `analysis:${repoUrl}`
  const { data, error } = await tryCatch(redis.get<AnalyzerAPIResult>(key))

  if (error) {
    console.error("Cache get error:", error)
    return null
  }

  return data
}

/**
 * Get cached analysis results using Redis SCAN
 *
 * @param limit - Maximum number of results to return
 * @returns Array of analysis results
 */
export const getCachedAnalyses = async (limit = DEFAULT_LIMIT) => {
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
export const cacheAnalysis = async (repoUrl: string, data: AnalyzerAPIResult) => {
  const key = `analysis:${repoUrl}`
  const { error } = await tryCatch(redis.set(key, data, { ex: 60 * 60 * 24 * 30 }))

  if (error) {
    console.error("Cache set error:", error)
  }
}

/**
 * Analyze the stack of a repository by its URL
 * @param url - The repository URL
 * @returns The analysis
 */
export const analyzeRepositoryStack = async (url: string) => {
  const repository = getRepositoryString(url)

  // Get analysis
  const analysis = await analyzerApi.url("/analyze").post({ repository })

  // Cache analysis
  await cacheAnalysis(repository, analysis)

  // Return analysis
  return analysis
}
