"use client"

import { type Values, useQueryStates } from "nuqs"
import { type PropsWithChildren, createContext, use, useTransition } from "react"
import { alternativesSearchParams } from "~/server/web/alternatives/schemas"

export type AlternativeFiltersContextType = {
  filters: Values<typeof alternativesSearchParams>
  isLoading: boolean
  updateFilters: (values: Partial<Values<typeof alternativesSearchParams>>) => void
}

const AlternativeFiltersContext = createContext<AlternativeFiltersContextType>(null!)

const AlternativeFiltersProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, startTransition] = useTransition()

  const [filters, setFilters] = useQueryStates(alternativesSearchParams, {
    shallow: false,
    throttleMs: 300,
    startTransition,
  })

  const updateFilters = (values: Partial<Values<typeof alternativesSearchParams>>) => {
    setFilters(prev => ({ ...prev, ...values, page: null }))
  }

  return (
    <AlternativeFiltersContext.Provider value={{ filters, isLoading, updateFilters }}>
      {children}
    </AlternativeFiltersContext.Provider>
  )
}

const useAlternativeFilters = () => {
  const context = use(AlternativeFiltersContext)

  if (context === undefined) {
    throw new Error("useAlternativeFilter must be used within a AlternativeFilterProvider")
  }

  return context
}

export { AlternativeFiltersProvider, useAlternativeFilters }
