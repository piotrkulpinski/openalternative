import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findLicenses } from "~/server/admin/licenses/queries"
import { adminLicensesSearchParams } from "~/server/admin/licenses/schemas"
import { LicensesTable } from "./_components/licenses-table"

type LicensesPageProps = {
  searchParams: Promise<SearchParams>
}

export default async function LicensesPage(props: LicensesPageProps) {
  const searchParams = await props.searchParams
  const search = adminLicensesSearchParams.parse(searchParams)
  const licensesPromise = findLicenses(search)

  return (
    <Suspense fallback={<DataTableSkeleton title="Licenses" />}>
      <LicensesTable licensesPromise={licensesPromise} />
    </Suspense>
  )
}
