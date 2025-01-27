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
import { cx } from "~/utils/cva"

const filterTypes = searchConfig.filters

export const ToolFilters = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  const { filters, updateFilters } = useToolFilters()
  const { execute, isPending, data } = useServerAction(findFilterOptions)

  useEffect(() => {
    execute()
  }, [execute])

  const hasActiveFilters = filterTypes.some(type => filters[type].length > 0)

  const handleRemoveFilter = useCallback(
    (type: (typeof filterTypes)[number], value: string) => {
      updateFilters({
        [type]: filters[type].filter(v => v !== value),
      })
    },
    [updateFilters],
  )

  const handleClearAll = useCallback(() => {
    updateFilters(Object.fromEntries(filterTypes.map(filter => [filter, []])))
  }, [updateFilters])

  return (
    <div className={cx("grid w-full grid-cols-xs gap-4", className)} {...props}>
      {filterTypes.map(type => (
        <ToolRefinement key={type} filter={type} items={data?.[type] ?? []} isPending={isPending} />
      ))}

      {hasActiveFilters && (
        <Stack className="col-span-full" size="sm">
          {filterTypes.map(type => {
            const activeItems = filters[type]
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
