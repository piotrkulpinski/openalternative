import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { findCategories } from "~/server/categories/queries"
import { searchTools } from "~/server/tools/queries"
import { toolsSearchParamsCache } from "~/server/tools/search-params"

type HomeToolListingProps = {
  searchParams: Promise<SearchParams>
}

export const HomeToolListing = async ({ searchParams }: HomeToolListingProps) => {
  const parsedParams = toolsSearchParamsCache.parse(await searchParams)

  const [{ tools, totalCount }, categories] = await Promise.all([
    searchTools(parsedParams, {}),
    findCategories({}),
  ])

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      categories={categories}
    />
  )
}
