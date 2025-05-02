"use client"

import { Icon } from "~/components/common/icon"
import { Input } from "~/components/common/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { Stack } from "~/components/common/stack"
import { useFilters } from "~/contexts/filter-context"

export type AlternativeSearchProps = {
  placeholder?: string
}

export const AlternativeSearch = ({ placeholder }: AlternativeSearchProps) => {
  const { filters, isLoading, updateFilters } = useFilters()

  const sortOptions = [
    { value: "default.desc", label: "Default" },
    { value: "pageviews.desc", label: "Most Popular" },
    { value: "createdAt.desc", label: "Latest" },
    { value: "name.asc", label: "Name A-Z" },
    { value: "name.desc", label: "Name Z-A" },
  ]

  return (
    <Stack className="w-full">
      <div className="relative grow min-w-0">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
          {isLoading ? (
            <Icon name="lucide/loader" className="animate-spin" />
          ) : (
            <Icon name="lucide/search" />
          )}
        </div>

        <Input
          size="lg"
          value={filters.q || ""}
          onChange={e => updateFilters({ q: e.target.value })}
          placeholder={placeholder || "Search alternatives..."}
          className="pl-10"
        />
      </div>

      <Select value={filters.sort} onValueChange={value => updateFilters({ sort: value })}>
        <SelectTrigger size="lg" className="w-auto min-w-36 max-sm:flex-1">
          <SelectValue placeholder="Order by" />
        </SelectTrigger>

        <SelectContent align="end">
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Stack>
  )
}
