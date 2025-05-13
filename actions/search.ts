"use server"

import type { FederatedMultiSearchParams } from "meilisearch"
import { z } from "zod"
import { createServerAction } from "zsa"
import { meilisearch } from "~/services/meilisearch"

export type ToolSearchResult = {
  slug: string
  name: string
  websiteUrl: string
  faviconUrl?: string
  _federation: { indexUid: "tools"; queriesPosition: number }
}

export type AlternativeSearchResult = {
  slug: string
  name: string
  faviconUrl?: string
  _federation: { indexUid: "alternatives"; queriesPosition: number }
}

export type CategorySearchResult = {
  slug: string
  name: string
  fullPath: string
  _federation: { indexUid: "categories"; queriesPosition: number }
}

export type SearchResult = ToolSearchResult | AlternativeSearchResult | CategorySearchResult

export const searchItems = createServerAction()
  .input(z.object({ query: z.string().trim() }))
  .handler(async ({ input: { query } }) => {
    const start = performance.now()

    // Use Meilisearch federated multiSearch for all indices, merging results
    const searchResult = await meilisearch.multiSearch<FederatedMultiSearchParams, SearchResult>({
      federation: {},
      queries: [
        {
          indexUid: "tools",
          q: query,
          rankingScoreThreshold: 0.4,
          hybrid: { embedder: "openai", semanticRatio: 0.5 },
          attributesToRetrieve: ["slug", "name", "websiteUrl", "faviconUrl"],
        },
        {
          indexUid: "alternatives",
          q: query,
          rankingScoreThreshold: 0.5,
          hybrid: { embedder: "openai", semanticRatio: 0.5 },
          attributesToRetrieve: ["slug", "name", "faviconUrl"],
        },
        {
          indexUid: "categories",
          q: query,
          rankingScoreThreshold: 0.6,
          hybrid: { embedder: "openai", semanticRatio: 0.5 },
          attributesToRetrieve: ["slug", "name", "fullPath"],
        },
      ],
    })

    return (searchResult.hits || []).reduce<Record<string, SearchResult[]>>((acc, result) => {
      const key = result._federation.indexUid
      if (!acc[key]) acc[key] = []
      acc[key].push(result)
      return acc
    }, {})
  })
