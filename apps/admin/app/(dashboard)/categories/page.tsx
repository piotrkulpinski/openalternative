import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/data-table/DataTableSkeleton"
import { searchParamsSchema } from "~/schema/searchParams"
import type { SearchParams } from "~/types"
import { CategoriesTable } from "./_components/CategoriesTable"
import { getCategories } from "./_lib/queries"

export interface CategoriesPageProps {
  searchParams: SearchParams
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const search = searchParamsSchema.parse(searchParams)
  const categoriesPromise = getCategories(search)

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          title="Categories"
          columnCount={5}
          rowCount={15}
          searchableColumnCount={1}
          filterableColumnCount={2}
          cellWidths={["12%", "48%", "15%", "15%", "10%"]}
          shrinkZero
        />
      }
    >
      <CategoriesTable categoriesPromise={categoriesPromise} />
    </Suspense>
  )
}
