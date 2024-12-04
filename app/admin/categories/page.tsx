import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/admin/data-table/data-table-skeleton"
import { findCategories } from "~/server/admin/categories/queries"
import { CategoriesTable } from "./_components/categories-table"

export interface CategoriesPageProps {
  searchParams: Promise<SearchParams>
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const categoriesPromise = findCategories(await searchParams)

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
