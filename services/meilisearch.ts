import { MeiliSearch } from "meilisearch"
import { env } from "~/env"

export const meilisearch = new MeiliSearch({
  host: env.MEILISEARCH_HOST,
  apiKey: env.MEILISEARCH_SEARCH_KEY,
})

/**
 * Get a Meilisearch index
 * @param index - The name of the index to get
 * @returns The Meilisearch index
 */
export const getMeilisearchIndex = (index: string) => {
  return meilisearch.index(index)
}
