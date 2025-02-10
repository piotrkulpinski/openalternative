"use client"

import { LoaderIcon, SearchIcon } from "lucide-react"
import { Stack } from "~/components/common/stack"
import { Input } from "~/components/web/ui/input"
import { Select } from "~/components/web/ui/select"
import { useAlternativeFilters } from "~/contexts/alternative-filter-context"

export type AlternativeSearchProps = {
  placeholder?: string
}

export const AlternativeSearch = ({ placeholder }: AlternativeSearchProps) => {
  const { filters, isLoading, updateFilters } = useAlternativeFilters()

  const sortOptions = [
    { value: "popularity.desc", label: "Popularity" },
    { value: "createdAt.desc", label: "Latest" },
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
          value={filters.q || ""}
          onChange={e => updateFilters({ q: e.target.value })}
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
