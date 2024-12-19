"use server"

import { prisma } from "@openalternative/db"
import { headers } from "next/headers"
import { createServerAction } from "zsa"
import { isProd } from "~/env"
import { type AnalyzerAPIResult, analyzerApi } from "~/lib/apis"
import { isRateLimited } from "~/lib/rate-limiter"
import { stackAnalyzerSchema } from "~/server/schemas"
import { stackManyPayload } from "~/server/web/stacks/payloads"
import { toolOnePayload } from "~/server/web/tools/payloads"
import { redis } from "~/services/redis"

/**
 * Get the IP address of the client
 * @returns IP address
 */
const getIP = async () => {
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
const getCachedAnalysis = async (repoUrl: string): Promise<AnalyzerAPIResult | null> => {
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
 * Cache the analysis in Redis
 * @param repoUrl - The repository URL
 * @param data - The analysis data
 */
const cacheAnalysis = async (repoUrl: string, data: AnalyzerAPIResult): Promise<void> => {
  if (!isProd) return

  try {
    const key = `analysis:${repoUrl}`
    await redis.set(key, data, { ex: 60 * 60 * 24 * 30 }) // Cache for 30 days
  } catch (error) {
    console.error("Cache set error:", error)
  }
}

export const analyzeStack = createServerAction()
  .input(stackAnalyzerSchema)
  .handler(async ({ input }) => {
    try {
      const ip = await getIP()

      // Rate limiting check
      if (await isRateLimited(ip)) {
        throw new Error("Too many requests. Please try again in a minute.")
      }

      // Get tech analysis from cache or API
      const analysis =
        (await getCachedAnalysis(input.repository)) ??
        (await analyzerApi
          .url("/analyze")
          .post({ repository: input.repository })
          .then(async response => {
            await cacheAnalysis(input.repository, response)
            return response
          }))

      // Return empty array if no tech keys found
      if (!analysis) {
        return
      }

      const [stacks, tool] = await Promise.all([
        prisma.stack.findMany({
          where: { slug: { in: analysis.stack } },
          orderBy: [{ tools: { _count: "desc" } }, { name: "asc" }],
          select: stackManyPayload,
        }),

        prisma.tool.findUnique({
          where: { repository: analysis.repository.url },
          select: toolOnePayload,
        }),
      ])

      // Get stack details from database
      return {
        stacks,
        tool,
        repository: analysis.repository,
      }
    } catch (error) {
      console.error("Stack analysis error:", error)
      throw new Error("Stack analysis error. Please try again later.")
    }
  })
