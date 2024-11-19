import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server"
import { config } from "~/config"

export const searchParams = {
  q: parseAsString,
  category: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  sort: parseAsString.withDefault("publishedAt.desc"),
  perPage: parseAsInteger.withDefault(config.site.toolsPerPage),
}

export const searchParamsCache = createSearchParamsCache(searchParams)
