import { MeiliSearch } from "meilisearch"
import { config } from "~/config"
import { env } from "~/env"

export const meili = new MeiliSearch({
  host: env.MEILISEARCH_HOST,
  apiKey: env.MEILISEARCH_ADMIN_KEY,
})

/**
 * Get a Meilisearch index
 * @param index - The name of the index to get
 * @returns The Meilisearch index
 */
export const getMeiliIndex = (index: string) => {
  return meili.index(`${config.site.slug}-${index}`)
}
