"use server"

import { createServerAction } from "zsa"
import { analyzerApi } from "~/lib/apis"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { cacheAnalysis, getCachedAnalysis } from "~/lib/stack-analysis"
import { stackAnalyzerSchema } from "~/server/schemas"

export const analyzeStack = createServerAction()
  .input(stackAnalyzerSchema)
  .handler(async ({ input: { repository } }) => {
    try {
      const ip = await getIP()

      // Rate limiting check
      if (await isRateLimited(ip, "stackAnalysis")) {
        throw new Error("Too many requests. Please try again in a minute.")
      }

      // Get tech analysis from cache or API
      if (await getCachedAnalysis(repository)) {
        return repository
      }

      await analyzerApi
        .url("/analyze")
        .post({ repository: repository })
        .then(async response => {
          await cacheAnalysis(repository, response)
          return response
        })

      return repository
    } catch (error) {
      console.error("Stack analysis error:", error)
      throw new Error("Stack analysis error. Please try again later.")
    }
  })
