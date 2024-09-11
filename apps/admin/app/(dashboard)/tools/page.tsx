import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/data-table/DataTableSkeleton"
import { searchParamsSchema } from "~/schema/searchParams"
import type { SearchParams } from "~/types"
import { ToolsTable } from "./_components/ToolsTable"
import { getTools } from "./_lib/queries"

export interface ToolsPageProps {
  searchParams: SearchParams
}

export default function ToolsPage({ searchParams }: ToolsPageProps) {
  const search = searchParamsSchema.parse(searchParams)
  const toolsPromise = getTools(search)

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          title="Tools"
          columnCount={5}
          rowCount={15}
          searchableColumnCount={1}
          filterableColumnCount={2}
          cellWidths={["12%", "48%", "15%", "15%", "10%"]}
          shrinkZero
        />
      }
    >
      <ToolsTable toolsPromise={toolsPromise} />
    </Suspense>
  )
}
