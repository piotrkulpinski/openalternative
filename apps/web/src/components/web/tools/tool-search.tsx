"use client"

import { useDebounce } from "@uidotdev/usehooks"
import { useLocalStorage } from "@uidotdev/usehooks"
import { cx } from "cva"
import { ListFilterIcon, LoaderIcon, SearchIcon } from "lucide-react"
import { type Values, useQueryStates } from "nuqs"
import { useEffect, useState, useTransition } from "react"
import { Stack } from "~/components/common/stack"
import { ToolFilters } from "~/components/web/tools/tool-filters"
import { Input } from "~/components/web/ui/input"
import { Select } from "~/components/web/ui/select"
import { toolsSearchParams } from "~/server/web/tools/search-params"

export type ToolSearchProps = {
  placeholder?: string
}

export const ToolSearch = ({ placeholder }: ToolSearchProps) => {
  const [isLoading, startTransition] = useTransition()
  const [isFiltersOpen, setIsFiltersOpen] = useLocalStorage("filtersOpen", false)
  const [filters, setFilters] = useQueryStates(toolsSearchParams, {
    shallow: false,
    startTransition,
  })
  const [inputValue, setInputValue] = useState(filters.q || "")
  const q = useDebounce(inputValue, 300)

  const updateFilters = (values: Partial<Values<typeof toolsSearchParams>>) => {
    setFilters({ ...values, page: null })
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

  const sortOptions = [
    { value: "publishedAt.desc", label: "Recently Added" },
    { value: "name.asc", label: "Name (A to Z)" },
    { value: "name.desc", label: "Name (Z to A)" },
    { value: "stars.desc", label: "Most Stars" },
    { value: "forks.desc", label: "Most Forks" },
    { value: "lastCommitDate.desc", label: "Recently Updated" },
    { value: "firstCommitDate.desc", label: "Newest Projects" },
  ]

  return (
    <Stack size="lg" direction="column" className="w-full">
      <Stack className="w-full">
        <div className="relative grow min-w-0">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
            {isLoading ? <LoaderIcon className="animate-spin" /> : <SearchIcon />}
          </div>

          <Input
            size="lg"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={placeholder || "Search tools..."}
            className="w-full truncate px-10"
          />

          <button
            type="button"
            className={cx(
              "absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-2 py-1.5 px-2.5 rounded-md",
              isFiltersOpen
                ? "bg-card-dark text-foreground"
                : "text-muted hover:bg-card-dark hover:text-foreground",
            )}
            onClick={() => setIsFiltersOpen(prev => !prev)}
          >
            <ListFilterIcon className="size-4" />
            <span className="text-sm leading-none">Filters</span>
          </button>
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

      {isFiltersOpen && <ToolFilters filters={filters} updateFilters={updateFilters} />}
    </Stack>
  )
}
