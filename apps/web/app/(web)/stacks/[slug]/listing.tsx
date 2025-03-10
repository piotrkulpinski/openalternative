import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { filterParamsCache } from "~/server/web/shared/schemas"
import type { StackOne } from "~/server/web/stacks/payloads"
import { searchTools } from "~/server/web/tools/queries"

type StackToolListingProps = {
  stack: StackOne
  searchParams: Promise<SearchParams>
}

export const StackToolListing = async ({ stack, searchParams }: StackToolListingProps) => {
  const parsedParams = filterParamsCache.parse(await searchParams)

  const { tools, totalCount } = await searchTools(parsedParams, {
    stacks: { some: { slug: stack.slug } },
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in ${totalCount} tools using ${stack.name}...`}
    />
  )
}
