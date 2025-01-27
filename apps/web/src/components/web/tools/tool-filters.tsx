"use client"

import { XIcon } from "lucide-react"
import type { Values } from "nuqs"
import { type HTMLAttributes, useEffect, useMemo } from "react"
import { useServerAction } from "zsa-react"
import { Stack } from "~/components/common/stack"
import { ToolRefinement } from "~/components/web/tools/tool-refinement"
import { Badge } from "~/components/web/ui/badge"
import { config } from "~/config"
import { findFilterOptions } from "~/server/web/tools/actions"
import type { toolsSearchParams } from "~/server/web/tools/search-params"
import { cx } from "~/utils/cva"

export type ToolFiltersProps = HTMLAttributes<HTMLDivElement> & {
  filters: Values<typeof toolsSearchParams>
  updateFilters: (values: Partial<Values<typeof toolsSearchParams>>) => void
}

export const ToolFilters = ({ className, filters, updateFilters, ...props }: ToolFiltersProps) => {
  const { execute, isPending, data } = useServerAction(findFilterOptions)

  useEffect(() => {
    execute()
  }, [execute])

  const activeFiltersByType = useMemo(
    () =>
      config.search.filters.reduce(
        (acc, filterType) => {
          const values = filters[filterType] as string[]
          if (!values?.length) return acc

          acc[filterType] = values.map(value => ({
            value,
            name: data?.[filterType]?.find(item => item.slug === value)?.name ?? value,
          }))
          return acc
        },
        {} as Record<(typeof config.search.filters)[number], { value: string; name: string }[]>,
      ),
    [filters, data],
  )

  const hasActiveFilters = Object.keys(activeFiltersByType).length > 0

  const handleRemoveFilter = (
    filterType: (typeof config.search.filters)[number],
    value: string,
  ) => {
    updateFilters({
      [filterType]: filters[filterType].filter(v => v !== value),
    })
  }

  const handleClearAll = () => {
    const resetFilters = Object.fromEntries(
      config.search.filters.map(filter => [filter, [] as string[]]),
    )
    updateFilters(resetFilters)
  }

  return (
    <div className={cx("grid w-full grid-cols-xs gap-4", className)} {...props}>
      {config.search.filters.map(filterType => (
        <ToolRefinement
          key={filterType}
          filter={filterType}
          items={data?.[filterType] ?? []}
          isPending={isPending}
          filters={filters}
          updateFilters={updateFilters}
        />
      ))}

      {hasActiveFilters && (
        <Stack className="col-span-full">
          {Object.entries(activeFiltersByType).map(([filterType, values]) => (
            <Stack key={filterType} size="xs">
              <span className="text-xs font-medium capitalize text-secondary">{filterType}:</span>

              {values.map(({ value, name }) => (
                <Badge key={`${filterType}-${value}`} suffix={<XIcon className="size-3" />} asChild>
                  <button type="button" onClick={() => handleRemoveFilter(filterType, value)}>
                    {name}
                  </button>
                </Badge>
              ))}
            </Stack>
          ))}

          <Badge variant="outline" asChild>
            <button type="button" onClick={handleClearAll}>
              Clear all
            </button>
          </Badge>
        </Stack>
      )}
    </div>
  )
}
