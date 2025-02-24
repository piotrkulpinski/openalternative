import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/admin/data-table/data-table-skeleton"
import { findReports } from "~/server/admin/reports/queries"
import { searchParamsCache } from "~/server/admin/reports/validations"
import { ReportsTable } from "./_components/reports-table"

type ReportsPageProps = {
  searchParams: Promise<SearchParams>
}

export default async function ReportsPage(props: ReportsPageProps) {
  const searchParams = await props.searchParams
  const search = searchParamsCache.parse(searchParams)
  const reportsPromise = findReports(search)

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          title="Reports"
          searchableColumnCount={1}
          filterableColumnCount={2}
          shrinkZero
        />
      }
    >
      <ReportsTable reportsPromise={reportsPromise} />
    </Suspense>
  )
}
