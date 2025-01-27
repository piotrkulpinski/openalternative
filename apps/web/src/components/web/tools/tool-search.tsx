"use client"

import { useLocalStorage } from "@mantine/hooks"
import { cx } from "cva"
import { ListFilterIcon, LoaderIcon, SearchIcon } from "lucide-react"
import { Stack } from "~/components/common/stack"
import { ToolFilters } from "~/components/web/tools/tool-filters"
import { Input } from "~/components/web/ui/input"
import { Select } from "~/components/web/ui/select"
import { useToolFilters } from "~/hooks/use-tool-filters"

export type ToolSearchProps = {
  placeholder?: string
}

export const ToolSearch = ({ placeholder }: ToolSearchProps) => {
  const { filters, isLoading, updateFilters } = useToolFilters()

  const [isFiltersOpen, setIsFiltersOpen] = useLocalStorage({
    key: "filtersOpen",
    defaultValue: false,
  })

  const sortOptions = [
    { value: "publishedAt.desc", label: "Latest" },
    { value: "name.asc", label: "Name (A to Z)" },
    { value: "name.desc", label: "Name (Z to A)" },
    { value: "stars.desc", label: "Most Stars" },
    { value: "forks.desc", label: "Most Forks" },
    { value: "lastCommitDate.desc", label: "Last Commit" },
    { value: "firstCommitDate.desc", label: "Repository Age" },
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
            value={filters.q || ""}
            onChange={e => updateFilters({ q: e.target.value })}
            placeholder={isLoading ? "Loading..." : placeholder || "Search tools..."}
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
            <span className="text-sm leading-none max-sm:sr-only">Filters</span>
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

      {isFiltersOpen && <ToolFilters />}
    </Stack>
  )
}
