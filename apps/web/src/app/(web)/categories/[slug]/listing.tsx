import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { CategoryOne } from "~/server/web/categories/payloads"
import { searchTools } from "~/server/web/tools/queries"
import { toolsSearchParamsCache } from "~/server/web/tools/search-params"

type CategoryToolListingProps = {
  category: CategoryOne
  searchParams: Promise<SearchParams>
}

export const CategoryToolListing = async ({ category, searchParams }: CategoryToolListingProps) => {
  const parsedParams = toolsSearchParamsCache.parse(await searchParams)

  const { tools, totalCount } = await searchTools(parsedParams, {
    where: { categories: { some: { slug: category.slug } } },
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in ${totalCount} ${category.label}...`}
      lockedFilters={[{ type: "category", value: category.slug }]}
    />
  )
}
