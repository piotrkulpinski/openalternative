"use server"

import { z } from "zod"
import { createServerAction } from "zsa"
import { getMeilisearchIndex } from "~/services/meilisearch"

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

    const results = await Promise.all([
      getMeilisearchIndex("tools").search<ToolSearchResult>(query, {
        rankingScoreThreshold: 0.5,
        hybrid: { embedder: "openai", semanticRatio: 0.5 },
        attributesToRetrieve: ["slug", "name", "websiteUrl", "faviconUrl"],
      }),

      getMeilisearchIndex("alternatives").search<AlternativeSearchResult>(query, {
        rankingScoreThreshold: 0.5,
        hybrid: { embedder: "openai", semanticRatio: 0.5 },
        attributesToRetrieve: ["slug", "name", "faviconUrl"],
      }),

      getMeilisearchIndex("categories").search<CategorySearchResult>(query, {
        rankingScoreThreshold: 0.6,
        hybrid: { embedder: "openai", semanticRatio: 0.5 },
        attributesToRetrieve: ["slug", "name", "fullPath"],
      }),
    ])

    console.log(`Search: ${Math.round(performance.now() - start)}ms`)

    return results
  })
