import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/admin/data-table/data-table-skeleton"
import { findLicenses } from "~/server/admin/licenses/queries"
import { LicensesTable } from "./_components/licenses-table"

export interface LicensesPageProps {
  searchParams: Promise<SearchParams>
}

export default async function LicensesPage({ searchParams }: LicensesPageProps) {
  const licensesPromise = findLicenses(await searchParams)

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
