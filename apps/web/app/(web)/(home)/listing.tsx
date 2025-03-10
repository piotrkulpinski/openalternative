import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { filterParamsCache } from "~/server/web/shared/schemas"
import { searchTools } from "~/server/web/tools/queries"

type HomeToolListingProps = {
  searchParams: Promise<SearchParams>
}

export const HomeToolListing = async ({ searchParams }: HomeToolListingProps) => {
  const parsedParams = filterParamsCache.parse(await searchParams)
  const { tools, totalCount } = await searchTools(parsedParams)

  return (
    <ToolQuery tools={tools} totalCount={totalCount} perPage={parsedParams.perPage} enableFilters />
  )
}
