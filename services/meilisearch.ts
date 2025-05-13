import { MeiliSearch } from "meilisearch"
import { env } from "~/env"

export const meilisearch = new MeiliSearch({
  host: env.MEILISEARCH_URL,
  apiKey: env.MEILISEARCH_SEARCH_KEY,
})
