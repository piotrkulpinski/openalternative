import { ToolStatus } from "@openalternative/db/client"
import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { filterParamsCache } from "~/server/web/shared/schemas"
import { searchTools } from "~/server/web/tools/queries"

type ComingSoonToolListingProps = {
  searchParams: Promise<SearchParams>
}

export const ComingSoonToolListing = async ({ searchParams }: ComingSoonToolListingProps) => {
  const parsedParams = filterParamsCache.parse(await searchParams)

  const { tools, totalCount } = await searchTools(
    { ...parsedParams, sort: "publishedAt.asc" },
    { status: ToolStatus.Scheduled },
  )

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in ${totalCount} tools...`}
      enableSort={false}
    />
  )
}
