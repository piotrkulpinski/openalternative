import { createSearchParamsCache } from "nuqs/server"
import { config } from "~/config"

export const filtersCache = createSearchParamsCache(config.filters)
