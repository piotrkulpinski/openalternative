import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findTools } from "~/server/admin/tools/queries"
import { adminToolsSearchParams } from "~/server/admin/tools/schemas"
import { ToolsTable } from "./_components/tools-table"

type ToolsPageProps = {
  searchParams: Promise<SearchParams>
}

export default async function ToolsPage(props: ToolsPageProps) {
  const searchParams = await props.searchParams
  const search = adminToolsSearchParams.parse(searchParams)
  const toolsPromise = findTools(search)

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          title="Tools"
          searchableColumnCount={1}
          filterableColumnCount={2}
          shrinkZero
        />
      }
    >
      <ToolsTable toolsPromise={toolsPromise} />
    </Suspense>
  )
}
