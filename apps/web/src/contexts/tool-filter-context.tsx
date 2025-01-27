"use client"

import { useDebounce } from "@uidotdev/usehooks"
import { type Values, useQueryStates } from "nuqs"
import {
  type Dispatch,
  type PropsWithChildren,
  createContext,
  useEffect,
  useState,
  useTransition,
} from "react"
import { toolsSearchParams } from "~/server/web/tools/search-params"
import type { FilterType, LockedFilter } from "~/types/search"

export type ToolFiltersProviderProps = {
  lockedFilters?: LockedFilter[]
}

export type ToolFiltersContextType = ToolFiltersProviderProps & {
  filters: Values<typeof toolsSearchParams>
  isLoading: boolean
  inputValue: string
  setInputValue: Dispatch<React.SetStateAction<string>>
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
    startTransition,
    history: "push",
  })
  const [inputValue, setInputValue] = useState("")
  const q = useDebounce(inputValue, 300)

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

  // Update query param when input changes
  useEffect(() => {
    if (q !== filters.q) {
      updateFilters({ q: q || null })
    }
  }, [q])

  // Initialize input value from URL
  useEffect(() => {
    if (filters.q && !inputValue) {
      setInputValue(filters.q)
    }
  }, [filters.q])

  return (
    <ToolFiltersContext.Provider
      value={{
        lockedFilters,
        filters,
        isLoading,
        inputValue,
        setInputValue,
        updateFilters,
        getFilterValues,
      }}
    >
      {children}
    </ToolFiltersContext.Provider>
  )
}

export { ToolFiltersContext, ToolFiltersProvider }
