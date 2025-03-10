import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { CategoryOne } from "~/server/web/categories/payloads"
import { filterParamsCache } from "~/server/web/shared/schemas"
import { searchTools } from "~/server/web/tools/queries"

type CategoryToolListingProps = {
  category: CategoryOne
  searchParams: Promise<SearchParams>
}

export const CategoryToolListing = async ({ category, searchParams }: CategoryToolListingProps) => {
  const parsedParams = filterParamsCache.parse(await searchParams)

  const { tools, totalCount } = await searchTools(parsedParams, {
    categories: { some: { slug: category.slug } },
    isSelfHosted: true,
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in ${totalCount} self-hosted ${category.label}...`}
    />
  )
}
