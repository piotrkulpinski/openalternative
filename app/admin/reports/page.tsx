import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findReports } from "~/server/admin/reports/queries"
import { reportsTableParamsCache } from "~/server/admin/reports/schema"
import { ReportsTable } from "./_components/reports-table"

type ReportsPageProps = {
  searchParams: Promise<SearchParams>
}

const ReportsPage = async ({ searchParams }: ReportsPageProps) => {
  const search = reportsTableParamsCache.parse(await searchParams)
  const reportsPromise = findReports(search)

  return (
    <Suspense fallback={<DataTableSkeleton title="Reports" />}>
      <ReportsTable reportsPromise={reportsPromise} />
    </Suspense>
  )
}

export default withAdminPage(ReportsPage)
