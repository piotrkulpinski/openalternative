"use client"

import { useDebouncedState } from "@mantine/hooks"
import { LoaderIcon, SearchIcon } from "lucide-react"
import { type Values, useQueryStates } from "nuqs"
import { useEffect, useTransition } from "react"
import { Stack } from "~/components/common/stack"
import { Input } from "~/components/web/ui/input"
import { Select } from "~/components/web/ui/select"
import { alternativesSearchParams } from "~/server/web/alternatives/search-params"

export type AlternativeSearchProps = {
  placeholder?: string
}

export const AlternativeSearch = ({ placeholder }: AlternativeSearchProps) => {
  const [isLoading, startTransition] = useTransition()
  const [filters, setFilters] = useQueryStates(alternativesSearchParams, {
    shallow: false,
    startTransition,
  })
  const [query, setQuery] = useDebouncedState(filters.q || "", 300)

  const updateFilters = (values: Partial<Values<typeof alternativesSearchParams>>) => {
    setFilters({ ...values, page: null })
  }

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      q: query || null,
      page: query && query !== prev.q ? null : prev.page,
    }))
  }, [query])

  useEffect(() => {
    setQuery(filters.q || "")
  }, [filters])

  const sortOptions = [
    { value: "popularity.desc", label: "Popularity" },
    { value: "name.asc", label: "Name A-Z" },
    { value: "name.desc", label: "Name Z-A" },
  ]

  return (
    <Stack className="w-full">
      <div className="relative grow min-w-0">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
          {isLoading ? <LoaderIcon className="animate-spin" /> : <SearchIcon />}
        </div>

        <Input
          size="lg"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder || "Search alternatives..."}
          className="w-full truncate pl-10"
        />
      </div>

      <Select
        size="lg"
        className="min-w-36 max-sm:flex-1"
        value={filters.sort}
        onChange={e => updateFilters({ sort: e.target.value })}
      >
        <option value="">Order by</option>

        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </Stack>
  )
}
