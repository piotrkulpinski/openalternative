import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { filterParamsCache } from "~/server/web/shared/schemas"
import { searchTools } from "~/server/web/tools/queries"

type SelfHostedToolListingProps = {
  searchParams: Promise<SearchParams>
}

export const SelfHostedToolListing = async ({ searchParams }: SelfHostedToolListingProps) => {
  const parsedParams = filterParamsCache.parse(await searchParams)

  const { tools, totalCount } = await searchTools(parsedParams, {
    isSelfHosted: true,
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in ${totalCount} self-hosted tools...`}
      enableFilters
    />
  )
}
