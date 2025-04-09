import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findAlternatives } from "~/server/admin/alternatives/queries"
import { alternativesTableParamsCache } from "~/server/admin/alternatives/schemas"
import { AlternativesTable } from "./_components/alternatives-table"

type AlternativesPageProps = {
  searchParams: Promise<SearchParams>
}

const AlternativesPage = async ({ searchParams }: AlternativesPageProps) => {
  const search = alternativesTableParamsCache.parse(await searchParams)
  const alternativesPromise = findAlternatives(search)

  return (
    <Suspense fallback={<DataTableSkeleton title="Alternatives" />}>
      <AlternativesTable alternativesPromise={alternativesPromise} />
    </Suspense>
  )
}

export default withAdminPage(AlternativesPage)
