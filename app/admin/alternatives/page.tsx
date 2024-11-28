import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/admin/data-table/data-table-skeleton"
import { AlternativesTable } from "./_components/alternatives-table"
import { getAlternatives } from "./_lib/queries"

export interface AlternativesPageProps {
  searchParams: Promise<SearchParams>
}

export default async function AlternativesPage({ searchParams }: AlternativesPageProps) {
  const alternativesPromise = getAlternatives(searchParams)

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          title="Alternatives"
          columnCount={5}
          rowCount={15}
          searchableColumnCount={1}
          filterableColumnCount={2}
          cellWidths={["12%", "48%", "15%", "15%", "10%"]}
          shrinkZero
        />
      }
    >
      <AlternativesTable alternativesPromise={alternativesPromise} />
    </Suspense>
  )
}
