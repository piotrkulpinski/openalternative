import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { CategoryOne } from "~/server/web/categories/payloads"
import { getCategoryDescendants } from "~/server/web/categories/queries"
import { filterParamsCache } from "~/server/web/shared/schemas"
import { searchTools } from "~/server/web/tools/queries"

type CategoryToolListingProps = {
  category: CategoryOne
  searchParams: Promise<SearchParams>
}

export const CategoryToolListing = async ({ category, searchParams }: CategoryToolListingProps) => {
  const parsedParams = filterParamsCache.parse(await searchParams)
  const categoryDescendants = await getCategoryDescendants(category.slug)

  const { tools, totalCount } = await searchTools(parsedParams, {
    categories: { some: { slug: { in: categoryDescendants } } },
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in ${totalCount} ${category.label}...`}
    />
  )
}
