"use client"

import { XIcon } from "lucide-react"
import { type ComponentProps, useCallback, useEffect } from "react"
import { useServerAction } from "zsa-react"
import { findFilterOptions } from "~/actions/filters"
import { Badge } from "~/components/common/badge"
import { Stack } from "~/components/common/stack"
import { ToolRefinement } from "~/components/web/tools/tool-refinement"
import { searchConfig } from "~/config/search"
import { useToolFilters } from "~/contexts/tool-filter-context"
import type { FilterType } from "~/types/search"
import { cx } from "~/utils/cva"

export const ToolFilters = ({ className, ...props }: ComponentProps<"div">) => {
  const { filters, updateFilters, getFilterValues } = useToolFilters()
  const { execute, isPending, data } = useServerAction(findFilterOptions)

  useEffect(() => {
    execute()
  }, [execute])

  const hasActiveFilters = searchConfig.filters.some(type => getFilterValues(type).length > 0)

  const handleRemoveFilter = useCallback(
    (type: FilterType, value: string) => {
      const currentValues = getFilterValues(type)
      updateFilters({ [type]: currentValues.filter(v => v !== value) })
    },
    [updateFilters, getFilterValues],
  )

  const handleClearAll = useCallback(() => {
    const clearedFilters = Object.fromEntries(searchConfig.filters.map(f => [f, []]))
    updateFilters(clearedFilters)
  }, [updateFilters])

  return (
    <div className={cx("grid w-full grid-cols-xs gap-4", className)} {...props}>
      {searchConfig.filters.map(type => (
        <ToolRefinement key={type} filter={type} items={data?.[type] ?? []} isPending={isPending} />
      ))}

      {hasActiveFilters && (
        <Stack className="col-span-full" size="sm">
          {searchConfig.filters.map(type => {
            const activeItems = getFilterValues(type)
            if (!activeItems.length) return null

            return (
              <Stack key={type} size="xs">
                <span className="text-xs font-medium capitalize text-secondary-foreground">
                  {type}:
                </span>

                <Stack direction="row" className="flex-wrap gap-1.5">
                  {activeItems.map(slug => {
                    const item = data?.[type]?.find(item => item.slug === slug)
                    if (!item) return null

                    return (
                      <Badge
                        key={`${type}-${slug}`}
                        suffix={
                          <button
                            type="button"
                            onClick={() => handleRemoveFilter(type, slug)}
                            className="opacity-75 hover:opacity-100"
                            aria-label={`Remove ${item.name} filter`}
                          >
                            <XIcon />
                          </button>
                        }
                      >
                        {item.name}
                      </Badge>
                    )
                  })}
                </Stack>
              </Stack>
            )
          })}

          <Badge variant="outline" asChild>
            <button type="button" onClick={handleClearAll} aria-label="Clear all filters">
              Clear all
            </button>
          </Badge>
        </Stack>
      )}
    </div>
  )
}
