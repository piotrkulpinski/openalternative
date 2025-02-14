"use client"

import { type Values, useQueryStates } from "nuqs"
import { type PropsWithChildren, createContext, use, useTransition } from "react"
import { toolsSearchParams } from "~/server/web/tools/search-params"
import type { FilterType, LockedFilter } from "~/types/search"

export type ToolFiltersProviderProps = {
  lockedFilters?: LockedFilter[]
}

export type ToolFiltersContextType = ToolFiltersProviderProps & {
  filters: Values<typeof toolsSearchParams>
  isLoading: boolean
  updateFilters: (values: Partial<Values<typeof toolsSearchParams>>) => void
  getFilterValues: (type: FilterType) => string[]
}

const ToolFiltersContext = createContext<ToolFiltersContextType | undefined>(undefined)

const ToolFiltersProvider = ({
  children,
  lockedFilters = [],
}: PropsWithChildren<ToolFiltersProviderProps>) => {
  const [isLoading, startTransition] = useTransition()

  const [filters, setFilters] = useQueryStates(toolsSearchParams, {
    shallow: false,
    throttleMs: 300,
    startTransition,
  })

  const updateFilters = (values: Partial<Values<typeof toolsSearchParams>>) => {
    // Don't update if trying to modify any locked filter
    if (lockedFilters.some(lock => values[lock.type])) return

    setFilters(prev => ({
      ...prev,
      ...values,
      page: null,
    }))
  }

  const getFilterValues = (type: FilterType) => {
    const lockedFilter = lockedFilters.find(f => f.type === type)
    if (lockedFilter) return [lockedFilter.value]
    return filters[type] || []
  }

  return (
    <ToolFiltersContext.Provider
      value={{
        lockedFilters,
        filters,
        isLoading,
        updateFilters,
        getFilterValues,
      }}
    >
      {children}
    </ToolFiltersContext.Provider>
  )
}

const useToolFilters = () => {
  const context = use(ToolFiltersContext)

  if (context === undefined) {
    throw new Error("useToolFilter must be used within a ToolFilterProvider")
  }

  return context
}

export { ToolFiltersProvider, useToolFilters }
