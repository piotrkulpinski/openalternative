import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/admin/data-table/data-table-skeleton"
import { findAlternatives } from "~/server/admin/alternatives/queries"
import { searchParamsCache } from "~/server/admin/alternatives/validations"
import { AlternativesTable } from "./_components/alternatives-table"

type AlternativesPageProps = {
  searchParams: Promise<SearchParams>
}

export default async function AlternativesPage(props: AlternativesPageProps) {
  const searchParams = await props.searchParams
  const search = searchParamsCache.parse(searchParams)
  const alternativesPromise = findAlternatives(search)

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          title="Alternatives"
          searchableColumnCount={1}
          filterableColumnCount={2}
          shrinkZero
        />
      }
    >
      <AlternativesTable alternativesPromise={alternativesPromise} />
    </Suspense>
  )
}
