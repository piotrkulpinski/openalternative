import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/admin/data-table/data-table-skeleton"
import { findCategories } from "~/server/admin/categories/queries"
import { searchParamsCache } from "~/server/admin/categories/validations"
import { CategoriesTable } from "./_components/categories-table"

type CategoriesPageProps = {
  searchParams: Promise<SearchParams>
}

export default async function CategoriesPage(props: CategoriesPageProps) {
  const searchParams = await props.searchParams
  const search = searchParamsCache.parse(searchParams)
  const categoriesPromise = findCategories(search)

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
