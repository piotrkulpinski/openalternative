"use server"

import { prisma } from "@openalternative/db"
import { headers } from "next/headers"
import { createServerAction } from "zsa"
import { analyzerApi } from "~/lib/apis"
import { cacheAnalysis, getCachedAnalysis, isRateLimited } from "~/lib/rate-limiter"
import { stackAnalyzerSchema } from "~/server/schemas"
import { stackManyPayload } from "~/server/web/stacks/payloads"

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

export const analyzeStack = createServerAction()
  .input(stackAnalyzerSchema)
  .handler(async ({ input }) => {
    try {
      const ip = await getIP()

      // Rate limiting check
      if (await isRateLimited(ip)) {
        throw new Error("Too many requests. Please try again in a minute.")
      }

      // Get tech stack keys from cache or API
      const techKeys =
        (await getCachedAnalysis(input.repository)) ??
        (await analyzerApi
          .url("/analyze")
          .post({ repository: input.repository })
          .then(async response => {
            await cacheAnalysis(input.repository, response)
            return response
          }))

      // Return empty array if no tech keys found
      if (!techKeys?.length) {
        return []
      }

      // Get stack details from database
      return await prisma.stack.findMany({
        where: { slug: { in: techKeys } },
        select: stackManyPayload,
      })
    } catch (error) {
      console.error("Stack analysis error:", error)
      throw new Error("Stack analysis error. Please try again later.")
    }
  })
