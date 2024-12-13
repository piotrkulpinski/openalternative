import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server"
import { config } from "~/config"

export const alternativesSearchParams = {
  q: parseAsString,
  page: parseAsInteger.withDefault(1),
  sort: parseAsString.withDefault(""),
  perPage: parseAsInteger.withDefault(config.site.alternativesPerPage),
}

export const alternativesSearchParamsCache = createSearchParamsCache(alternativesSearchParams)
