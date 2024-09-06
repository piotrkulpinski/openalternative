import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/data-table/DataTableSkeleton"
import { searchParamsSchema } from "~/schema/searchParams"
import type { SearchParams } from "~/types"
import { ToolsTable } from "./components/ToolsTable"
import { getTools } from "./lib/queries"

export interface ToolsPageProps {
  searchParams: SearchParams
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  const toolsPromise = getTools(search)

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          columnCount={5}
          searchableColumnCount={1}
          filterableColumnCount={2}
          cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
          shrinkZero
        />
      }
    >
      <ToolsTable toolsPromise={toolsPromise} />
    </Suspense>
  )
}
