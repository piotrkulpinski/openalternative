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
