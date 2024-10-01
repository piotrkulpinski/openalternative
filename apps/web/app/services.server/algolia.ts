import { algoliasearch } from "algoliasearch"

export const searchClient = algoliasearch(
  import.meta.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "",
  import.meta.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ?? "",
)
