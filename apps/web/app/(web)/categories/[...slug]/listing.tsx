import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { CategoryOne } from "~/server/web/categories/payloads"
import { getCategoryTreeSlugs } from "~/server/web/categories/queries"
import { filterParamsCache } from "~/server/web/shared/schemas"
import { searchTools } from "~/server/web/tools/queries"

type CategoryToolListingProps = {
  category: CategoryOne
  searchParams: Promise<SearchParams>
}

export const CategoryToolListing = async ({ category, searchParams }: CategoryToolListingProps) => {
  const parsedParams = filterParamsCache.parse(await searchParams)
  const categoryTreeSlugs = await getCategoryTreeSlugs(category.slug)

  const { tools, totalCount } = await searchTools(parsedParams, {
    categories: { some: { slug: { in: [category.slug, ...categoryTreeSlugs] } } },
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
