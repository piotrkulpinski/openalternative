import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { searchTools } from "~/server/web/tools/queries"
import { toolsSearchParamsCache } from "~/server/web/tools/search-params"

type HomeToolListingProps = {
  searchParams: Promise<SearchParams>
}

export const HomeToolListing = async ({ searchParams }: HomeToolListingProps) => {
  const parsedParams = toolsSearchParamsCache.parse(await searchParams)
  const { tools, totalCount } = await searchTools(parsedParams, {})

  return <ToolQuery tools={tools} totalCount={totalCount} perPage={parsedParams.perPage} />
}
