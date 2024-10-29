import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import type { SearchParams } from "~/types"
import { CategoriesTable } from "./_components/categories-table"
import { getCategories } from "./_lib/queries"

export interface CategoriesPageProps {
  searchParams: SearchParams
}

export default function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const categoriesPromise = getCategories(searchParams)

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
