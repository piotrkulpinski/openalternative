import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/data-table/DataTableSkeleton"
import { searchParamsSchema } from "~/schema/searchParams"
import type { SearchParams } from "~/types"
import { LicensesTable } from "./_components/LicensesTable"
import { getLicenses } from "./_lib/queries"

export interface LicensesPageProps {
  searchParams: SearchParams
}

export default async function LicensesPage({ searchParams }: LicensesPageProps) {
  const search = searchParamsSchema.parse(searchParams)
  const licensesPromise = getLicenses(search)

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
