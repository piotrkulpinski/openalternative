"use client"

import { type Values, useQueryStates } from "nuqs"
import { type PropsWithChildren, createContext, use, useTransition } from "react"
import { filterSearchParams } from "~/server/web/shared/schemas"

export type FiltersContextType = {
  filters: Values<typeof filterSearchParams>
  isLoading: boolean
  enableFilters: boolean
  updateFilters: (values: Partial<Values<typeof filterSearchParams>>) => void
}

const FiltersContext = createContext<FiltersContextType>(null!)


export type FiltersProviderProps = {
  enableFilters?: boolean
}

const FiltersProvider = ({ children, enableFilters = false }: PropsWithChildren<FiltersProviderProps>) => {
  const [isLoading, startTransition] = useTransition()

  const [filters, setFilters] = useQueryStates(filterSearchParams, {
    shallow: false,
    throttleMs: 300,
    startTransition,
  })

  const updateFilters = (values: Partial<Values<typeof filterSearchParams>>) => {
    setFilters(prev => ({ ...prev, ...values, page: null }))
  }

  return (
    <FiltersContext.Provider value={{ filters, isLoading, updateFilters, enableFilters }}>
      {children}
    </FiltersContext.Provider>
  )
}

const useFilters = () => {
  const context = use(FiltersContext)

  if (context === undefined) {
    throw new Error("useFilters must be used within a FiltersProvider")
  }

  return context
}

export { FiltersProvider, useFilters }
