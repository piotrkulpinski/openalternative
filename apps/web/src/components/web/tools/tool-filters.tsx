"use client"

import { XIcon } from "lucide-react"
import { useCallback, useEffect } from "react"
import type { HTMLAttributes } from "react"
import { useServerAction } from "zsa-react"
import { Stack } from "~/components/common/stack"
import { ToolRefinement } from "~/components/web/tools/tool-refinement"
import { Badge } from "~/components/web/ui/badge"
import { searchConfig } from "~/config/search"
import { useToolFilters } from "~/hooks/use-tool-filters"
import { findFilterOptions } from "~/server/web/tools/actions"
import type { FilterType } from "~/types/search"
import { cx } from "~/utils/cva"

export const ToolFilters = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  const { filters, lockedFilters = [], updateFilters, getFilterValues } = useToolFilters()
  const { execute, isPending, data } = useServerAction(findFilterOptions)

  useEffect(() => {
    execute()
  }, [execute])

  const lockedTypes = lockedFilters.map(f => f.type)
  const availableFilters = searchConfig.filters.filter(type => !lockedTypes.includes(type))
  const hasActiveFilters = availableFilters.some(type => getFilterValues(type).length > 0)

  const handleRemoveFilter = useCallback(
    (type: FilterType, value: string) => {
      if (lockedTypes.includes(type)) return

      const currentValues = getFilterValues(type)
      updateFilters({ [type]: currentValues.filter(v => v !== value) })
    },
    [updateFilters, getFilterValues, lockedTypes],
  )

  const handleClearAll = useCallback(() => {
    const clearedFilters = Object.fromEntries(availableFilters.map(filter => [filter, []]))
    updateFilters(clearedFilters)
  }, [updateFilters, availableFilters])

  return (
    <div className={cx("grid w-full grid-cols-xs gap-4", className)} {...props}>
      {searchConfig.filters.map(type => (
        <ToolRefinement
          key={type}
          filter={type}
          items={data?.[type] ?? []}
          isPending={isPending}
          disabled={lockedTypes.includes(type)}
          defaultValue={lockedFilters.find(f => f.type === type)?.value}
        />
      ))}

      {hasActiveFilters && (
        <Stack className="col-span-full" size="sm">
          {availableFilters.map(type => {
            const activeItems = getFilterValues(type)
            if (!activeItems.length) return null

            return (
              <Stack key={type} size="xs">
                <span className="text-xs font-medium capitalize text-secondary">{type}:</span>

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
