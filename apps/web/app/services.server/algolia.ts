import algoliasearch from "algoliasearch/lite"

export const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID ?? "",
  import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY ?? "",
)
