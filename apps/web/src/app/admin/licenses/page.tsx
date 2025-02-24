import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/admin/data-table/data-table-skeleton"
import { findLicenses } from "~/server/admin/licenses/queries"
import { searchParamsCache } from "~/server/admin/licenses/validations"
import { LicensesTable } from "./_components/licenses-table"

type LicensesPageProps = {
  searchParams: Promise<SearchParams>
}

export default async function LicensesPage(props: LicensesPageProps) {
  const searchParams = await props.searchParams
  const search = searchParamsCache.parse(searchParams)
  const licensesPromise = findLicenses(search)

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          title="Licenses"
          searchableColumnCount={1}
          filterableColumnCount={2}
          shrinkZero
        />
      }
    >
      <LicensesTable licensesPromise={licensesPromise} />
    </Suspense>
  )
}
