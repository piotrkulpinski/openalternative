import { algoliasearch } from "algoliasearch"
import { env } from "~/env"

export const algoliaClient = algoliasearch(
  env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  env.ALGOLIA_ADMIN_API_KEY,
)
