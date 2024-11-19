import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server"

export const searchParams = {
  q: parseAsString,
  category: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  sort: parseAsString.withDefault("publishedAt.desc"),
  perPage: parseAsInteger.withDefault(24),
}

export const searchParamsCache = createSearchParamsCache(searchParams)
