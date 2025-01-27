import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { StackOne } from "~/server/web/stacks/payloads"
import { searchTools } from "~/server/web/tools/queries"
import { toolsSearchParamsCache } from "~/server/web/tools/search-params"

type StackToolListingProps = {
  stack: StackOne
  searchParams: Promise<SearchParams>
}

export const StackToolListing = async ({ stack, searchParams }: StackToolListingProps) => {
  const parsedParams = toolsSearchParamsCache.parse(await searchParams)

  const { tools, totalCount } = await searchTools(parsedParams, {
    where: { stacks: { some: { slug: stack.slug } } },
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in ${totalCount} ${stack.name} tools...`}
      lockedFilters={[{ type: "stack", value: stack.slug }]}
    />
  )
}
