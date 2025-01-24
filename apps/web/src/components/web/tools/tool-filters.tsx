"use client"

import type { Values } from "nuqs"
import { type HTMLAttributes, useEffect } from "react"
import { useServerAction } from "zsa-react"
import { ToolRefinement } from "~/components/web/tools/tool-refinement"
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

  return (
    <div className={cx("grid grid-cols-xs justify-between gap-4 w-full", className)} {...props}>
      {config.search.filters.map(filter => (
        <ToolRefinement
          key={filter}
          filter={filter}
          items={data?.[filter] ?? []}
          isPending={isPending}
          filters={filters}
          updateFilters={updateFilters}
        />
      ))}
    </div>
  )
}
