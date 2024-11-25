"use client"

import { useQueryStates } from "nuqs"
import { EmptyList } from "~/components/web/empty-list"
import { Pagination } from "~/components/web/pagination"
import { ToolCard, ToolCardSkeleton } from "~/components/web/tools/tool-card"
import { ToolFilters, type ToolFiltersProps } from "~/components/web/tools/tool-filters"
import { Grid } from "~/components/web/ui/grid"
import { Input } from "~/components/web/ui/input"
import type { CategoryMany } from "~/server/categories/payloads"
import type { ToolMany } from "~/server/tools/payloads"
import { toolsSearchParams } from "~/server/tools/search-params"

type ToolListProps = ToolFiltersProps & {
  tools: ToolMany[]
  categories?: CategoryMany[]
  totalCount: number
}

const ToolList = ({ tools, totalCount, categories, ...props }: ToolListProps) => {
  const [{ q, perPage }] = useQueryStates(toolsSearchParams)

  return (
    <>
      <div className="flex flex-col gap-5">
        <ToolFilters categories={categories} {...props} />

        <Grid>
          {tools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}

          {!tools.length && <EmptyList>No tools found{q ? ` for "${q}"` : ""}.</EmptyList>}
        </Grid>
      </div>

      <Pagination pageSize={perPage} totalCount={totalCount} />
    </>
  )
}

const ToolListSkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <Input size="lg" disabled />

      <Grid>
        {[...Array(6)].map((_, index) => (
          <ToolCardSkeleton key={index} />
        ))}
      </Grid>
    </div>
  )
}

export { ToolList, ToolListSkeleton }
