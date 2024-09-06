import { Suspense } from "react"
import { DateRangePicker } from "~/components/DateRangePicker"
import { DataTableSkeleton } from "~/components/data-table/DataTableSkeleton"
import { Skeleton } from "~/components/ui/Skeleton"
import { searchParamsSchema } from "~/schema/searchParams"
import type { SearchParams } from "~/types"

export interface ToolsPageProps {
  searchParams: SearchParams
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  // const toolsPromise = getTools(search)

  return (
    <>
      <Suspense fallback={<Skeleton className="h-7 w-52" />}>
        <DateRangePicker triggerSize="sm" triggerClassName="ml-auto w-56 sm:w-60" align="end" />
      </Suspense>

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
        {/* <ToolsTable toolsPromise={toolsPromise} /> */}
      </Suspense>
    </>
  )
}
