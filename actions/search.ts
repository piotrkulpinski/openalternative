"use server"

import { z } from "zod"
import { createServerAction } from "zsa"
import { getMeiliIndex } from "~/services/meilisearch"
import { tryCatch } from "~/utils/helpers"

type ToolSearchResult = {
  slug: string
  name: string
  websiteUrl: string
  faviconUrl?: string
}

type AlternativeSearchResult = {
  slug: string
  name: string
  faviconUrl?: string
}

type CategorySearchResult = {
  slug: string
  name: string
  fullPath: string
}

export const searchItems = createServerAction()
  .input(z.object({ query: z.string().trim() }))
  .handler(async ({ input: { query } }) => {
    const start = performance.now()

    const { data, error } = await tryCatch(
      Promise.all([
        getMeiliIndex("tools").search<ToolSearchResult>(query, {
          rankingScoreThreshold: 0.5,
          hybrid: { embedder: "openai", semanticRatio: 0.5 },
          attributesToRetrieve: ["slug", "name", "websiteUrl", "faviconUrl"],
          filter: ["status = 'Published'"],
          sort: ["isFeatured:desc", "score:desc"],
        }),

        getMeiliIndex("alternatives").search<AlternativeSearchResult>(query, {
          rankingScoreThreshold: 0.5,
          hybrid: { embedder: "openai", semanticRatio: 0.5 },
          attributesToRetrieve: ["slug", "name", "faviconUrl"],
          sort: ["pageviews:desc"],
        }),

        getMeiliIndex("categories").search<CategorySearchResult>(query, {
          rankingScoreThreshold: 0.6,
          hybrid: { embedder: "openai", semanticRatio: 0.5 },
          attributesToRetrieve: ["slug", "name", "fullPath"],
        }),
      ]),
    )

    console.log(`Search: ${Math.round(performance.now() - start)}ms`)

    if (error) {
      console.error(error)
      return
    }

    return data
  })
