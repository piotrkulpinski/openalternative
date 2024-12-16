import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/admin/data-table/data-table-skeleton"
import { findTools } from "~/server/admin/tools/queries"
import { ToolsTable } from "./_components/tools-table"

export interface ToolsPageProps {
  searchParams: Promise<SearchParams>
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const toolsPromise = findTools(await searchParams)

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
