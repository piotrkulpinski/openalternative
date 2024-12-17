import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server"
import { config } from "~/config"

export const toolsSearchParams = {
  q: parseAsString,
  category: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  sort: parseAsString.withDefault(""),
  perPage: parseAsInteger.withDefault(config.site.toolsPerPage),
}

export const toolsSearchParamsCache = createSearchParamsCache(toolsSearchParams)
