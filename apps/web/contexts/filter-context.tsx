"use client"

import { type Values, useQueryStates } from "nuqs"
import { type PropsWithChildren, createContext, use, useTransition } from "react"
import { filterParamsSchema } from "~/server/web/shared/schemas"

export type FiltersContextType = {
  filters: Values<typeof filterParamsSchema>
  isLoading: boolean
  enableSort: boolean
  enableFilters: boolean
  updateFilters: (values: Partial<Values<typeof filterParamsSchema>>) => void
}

const FiltersContext = createContext<FiltersContextType>(null!)

export type FiltersProviderProps = {
  enableSort?: boolean
  enableFilters?: boolean
}

const FiltersProvider = ({
  children,
  enableSort = true,
  enableFilters = false,
}: PropsWithChildren<FiltersProviderProps>) => {
  const [isLoading, startTransition] = useTransition()

  const [filters, setFilters] = useQueryStates(filterParamsSchema, {
    shallow: false,
    throttleMs: 300,
    startTransition,
  })

  const updateFilters = (values: Partial<Values<typeof filterParamsSchema>>) => {
    setFilters(prev => ({ ...prev, ...values, page: null }))
  }

  return (
    <FiltersContext.Provider
      value={{ filters, isLoading, updateFilters, enableSort, enableFilters }}
    >
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
