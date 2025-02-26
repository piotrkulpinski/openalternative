import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findCategories } from "~/server/admin/categories/queries"
import { adminCategoriesSearchParams } from "~/server/admin/categories/schemas"
import { CategoriesTable } from "./_components/categories-table"

type CategoriesPageProps = {
  searchParams: Promise<SearchParams>
}

export default async function CategoriesPage(props: CategoriesPageProps) {
  const searchParams = await props.searchParams
  const search = adminCategoriesSearchParams.parse(searchParams)
  const categoriesPromise = findCategories(search)

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          title="Categories"
          searchableColumnCount={1}
          filterableColumnCount={2}
          shrinkZero
        />
      }
    >
      <CategoriesTable categoriesPromise={categoriesPromise} />
    </Suspense>
  )
}
