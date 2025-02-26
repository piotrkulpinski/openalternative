"use client"

import { type Values, parseAsArrayOf, parseAsString, useQueryStates } from "nuqs"
import { type PropsWithChildren, createContext, use, useTransition } from "react"
import { toolsSearchParams } from "~/server/web/tools/schemas"
import type { FilterType } from "~/types/search"

const filterSearchParams = {
  ...toolsSearchParams,
  alternative: parseAsArrayOf(parseAsString).withDefault([]),
  category: parseAsArrayOf(parseAsString).withDefault([]),
  stack: parseAsArrayOf(parseAsString).withDefault([]),
  license: parseAsArrayOf(parseAsString).withDefault([]),
}

export type ToolFiltersProviderProps = {
  enableFilters?: boolean
}

export type ToolFiltersContextType = {
  filters: Values<typeof filterSearchParams>
  isLoading: boolean
  enableFilters: boolean
  updateFilters: (values: Partial<Values<typeof filterSearchParams>>) => void
  getFilterValues: (type: FilterType) => string[]
}

const ToolFiltersContext = createContext<ToolFiltersContextType | undefined>(undefined)

const ToolFiltersProvider = ({
  children,
  enableFilters = false,
}: PropsWithChildren<ToolFiltersProviderProps>) => {
  const [isLoading, startTransition] = useTransition()

  const [filters, setFilters] = useQueryStates(filterSearchParams, {
    shallow: false,
    throttleMs: 300,
    startTransition,
  })

  const updateFilters = (values: Partial<Values<typeof filterSearchParams>>) => {
    setFilters(prev => ({
      ...prev,
      ...values,
      page: null,
    }))
  }

  const getFilterValues = (type: FilterType) => filters[type] || []

  return (
    <ToolFiltersContext.Provider
      value={{
        enableFilters,
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
