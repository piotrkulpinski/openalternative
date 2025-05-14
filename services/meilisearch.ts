import { MeiliSearch } from "meilisearch"
import { config } from "~/config"
import { env } from "~/env"

export const meilisearch = new MeiliSearch({
  host: env.MEILISEARCH_HOST,
  apiKey: env.MEILISEARCH_ADMIN_KEY,
})

/**
 * Get a Meilisearch index
 * @param index - The name of the index to get
 * @returns The Meilisearch index
 */
export const getMeilisearchIndex = (index: string) => {
  return meilisearch.index(`${config.site.slug}-${index}`)
}
