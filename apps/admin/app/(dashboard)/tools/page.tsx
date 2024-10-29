import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import type { SearchParams } from "~/types"
import { ToolsTable } from "./_components/tools-table"
import { getTools } from "./_lib/queries"

export interface ToolsPageProps {
  searchParams: SearchParams
}

export default function ToolsPage({ searchParams }: ToolsPageProps) {
  const toolsPromise = getTools(searchParams)

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
