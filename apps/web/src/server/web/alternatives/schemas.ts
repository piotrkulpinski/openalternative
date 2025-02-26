import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server"

export const alternativesSearchParams = {
  q: parseAsString.withDefault(""),
  sort: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(54),
}

export const alternativesSearchParamsCache = createSearchParamsCache(alternativesSearchParams)
