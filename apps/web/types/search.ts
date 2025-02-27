import type { searchConfig } from "~/config/search"

export type FilterType = (typeof searchConfig.filters)[number]

export type LockedFilter = {
  type: FilterType
  value: string
}

export type FilterOption = {
  slug: string
  name: string
  count: number
}
