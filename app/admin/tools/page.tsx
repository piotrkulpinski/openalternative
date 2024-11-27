import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/admin/data-table/data-table-skeleton"
import type { SearchParams } from "~/types"
import { requireAuthentication } from "~/utils/auth"
import { ToolsTable } from "./_components/tools-table"
import { getTools } from "./_lib/queries"

export interface ToolsPageProps {
  searchParams: Promise<SearchParams>
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  await requireAuthentication()
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
