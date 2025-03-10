import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findAlternatives } from "~/server/admin/alternatives/queries"
import { alternativesTableParamsCache } from "~/server/admin/alternatives/schemas"
import { AlternativesTable } from "./_components/alternatives-table"

type AlternativesPageProps = {
  searchParams: Promise<SearchParams>
}

export default async function AlternativesPage(props: AlternativesPageProps) {
  const searchParams = await props.searchParams
  const search = alternativesTableParamsCache.parse(searchParams)
  const alternativesPromise = findAlternatives(search)

  return (
    <Suspense fallback={<DataTableSkeleton title="Alternatives" />}>
      <AlternativesTable alternativesPromise={alternativesPromise} />
    </Suspense>
  )
}
