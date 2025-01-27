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
import type { LockedFilter } from "~/types/search"

export type ToolFiltersProviderProps = {
  lockedFilters?: LockedFilter[]
}

export type ToolFiltersContextType = ToolFiltersProviderProps & {
  filters: Values<typeof toolsSearchParams>
  isLoading: boolean
  inputValue: string
  setInputValue: Dispatch<React.SetStateAction<string>>
  updateFilters: (values: Partial<Values<typeof toolsSearchParams>>) => void
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
      // Preserve all locked filters
      ...Object.fromEntries(lockedFilters.map(lock => [lock.type, [lock.value]])),
      page: null,
    }))
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

  // Initialize locked filters
  useEffect(() => {
    const needsUpdate = lockedFilters.some(
      lock => !filters[lock.type]?.length || !filters[lock.type].includes(lock.value),
    )

    if (needsUpdate) {
      setFilters(prev => ({
        ...prev,
        ...Object.fromEntries(lockedFilters.map(lock => [lock.type, [lock.value]])),
      }))
    }
  }, [])

  return (
    <ToolFiltersContext.Provider
      value={{ lockedFilters, filters, isLoading, inputValue, setInputValue, updateFilters }}
    >
      {children}
    </ToolFiltersContext.Provider>
  )
}

export { ToolFiltersContext, ToolFiltersProvider }
