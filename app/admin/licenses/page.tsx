import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/admin/data-table/data-table-skeleton"
import type { SearchParams } from "~/types"
import { requireAuthentication } from "~/utils/auth"
import { LicensesTable } from "./_components/licenses-table"
import { getLicenses } from "./_lib/queries"

export interface LicensesPageProps {
  searchParams: Promise<SearchParams>
}

export default async function LicensesPage({ searchParams }: LicensesPageProps) {
  await requireAuthentication()
  const licensesPromise = getLicenses(searchParams)

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          title="Licenses"
          columnCount={5}
          rowCount={15}
          searchableColumnCount={1}
          filterableColumnCount={2}
          cellWidths={["12%", "48%", "15%", "15%", "10%"]}
          shrinkZero
        />
      }
    >
      <LicensesTable licensesPromise={licensesPromise} />
    </Suspense>
  )
}
