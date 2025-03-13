"use server"

import { createServerAction } from "zsa"
import { analyzerApi } from "~/lib/apis"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { cacheAnalysis, getCachedAnalysis } from "~/lib/stack-analysis"
import { stackAnalyzerSchema } from "~/server/schemas"
import { tryCatch } from "~/utils/helpers"

export const analyzeStack = createServerAction()
  .input(stackAnalyzerSchema)
  .handler(async ({ input: { repository } }) => {
    const ip = await getIP()
    const rateLimitKey = `stack-analysis:${ip}`

    // Rate limiting check
    if (await isRateLimited(rateLimitKey, "stackAnalysis")) {
      throw new Error("Too many requests. Please try again in a minute.")
    }

    // Get tech analysis from cache or API
    if (await getCachedAnalysis(repository)) {
      return repository
    }

    const { error } = await tryCatch(
      analyzerApi
        .url("/analyze")
        .post({ repository: repository })
        .then(async response => {
          await cacheAnalysis(repository, response)
          return response
        }),
    )

    if (error) {
      console.error("Stack analysis error:", error)
      throw new Error("Stack analysis error. Please try again later.")
    }

    return repository
  })
