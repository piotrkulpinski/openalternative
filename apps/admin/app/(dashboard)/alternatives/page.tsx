import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/data-table/DataTableSkeleton"
import { searchParamsSchema } from "~/schema/searchParams"
import type { SearchParams } from "~/types"
import { AlternativesTable } from "./_components/AlternativesTable"
import { getAlternatives } from "./_lib/queries"

export interface AlternativesPageProps {
  searchParams: SearchParams
}

export default function AlternativesPage({ searchParams }: AlternativesPageProps) {
  const search = searchParamsSchema.parse(searchParams)
  const alternativesPromise = getAlternatives(search)

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
