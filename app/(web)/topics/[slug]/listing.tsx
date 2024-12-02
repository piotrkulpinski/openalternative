import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { searchTools } from "~/server/tools/queries"
import { toolsSearchParamsCache } from "~/server/tools/search-params"
import type { TopicOne } from "~/server/topics/payloads"

type TopicToolListingProps = {
  topic: TopicOne
  searchParams: Promise<SearchParams>
}

export const TopicToolListing = async ({ topic, searchParams }: TopicToolListingProps) => {
  const parsedParams = toolsSearchParamsCache.parse(await searchParams)

  const { tools, totalCount } = await searchTools(parsedParams, {
    where: { topics: { some: { topic: { slug: topic.slug } } } },
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in "${topic.slug}"...`}
    />
  )
}
