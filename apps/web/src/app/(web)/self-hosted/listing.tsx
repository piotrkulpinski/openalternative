import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { findCategories } from "~/server/web/categories/queries"
import { searchTools } from "~/server/web/tools/queries"
import { toolsSearchParamsCache } from "~/server/web/tools/search-params"

type SelfHostedToolListingProps = {
  searchParams: Promise<SearchParams>
}

export const SelfHostedToolListing = async ({ searchParams }: SelfHostedToolListingProps) => {
  const parsedParams = toolsSearchParamsCache.parse(await searchParams)

  const [{ tools, totalCount }, categories] = await Promise.all([
    searchTools(parsedParams, { where: { isSelfHosted: true } }),
    findCategories({}),
  ])

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      categories={categories}
      placeholder={`Search in ${totalCount} self-hosted tools...`}
    />
  )
}
