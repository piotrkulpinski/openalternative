import { useDebounce } from "@uidotdev/usehooks"
import { type Values, useQueryStates } from "nuqs"
import { useEffect, useState, useTransition } from "react"
import { toolsSearchParams } from "~/server/web/tools/search-params"

export const useToolFilters = () => {
  const [isLoading, startTransition] = useTransition()
  const [filters, setFilters] = useQueryStates(toolsSearchParams, {
    shallow: false,
    startTransition,
  })
  const [inputValue, setInputValue] = useState(filters.q || "")
  const q = useDebounce(inputValue, 300)

  const updateFilters = (values: Partial<Values<typeof toolsSearchParams>>) => {
    setFilters(prev => ({ ...prev, ...values, page: null }))
  }

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      q: q || null,
      page: q && q !== prev.q ? null : prev.page,
    }))
  }, [q])

  useEffect(() => {
    setInputValue(filters.q || "")
  }, [filters])

  return {
    filters,
    isLoading,
    inputValue,
    setInputValue,
    updateFilters,
  }
}
