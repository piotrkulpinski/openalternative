import { capitalCase } from "change-case"
import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { filterParamsCache } from "~/server/web/shared/schemas"
import { searchTools } from "~/server/web/tools/queries"
import type { TopicOne } from "~/server/web/topics/payloads"

type TopicToolListingProps = {
  topic: TopicOne
  searchParams: Promise<SearchParams>
}

export const TopicToolListing = async ({ topic, searchParams }: TopicToolListingProps) => {
  const parsedParams = filterParamsCache.parse(await searchParams)

  const { tools, totalCount } = await searchTools(parsedParams, {
    topics: { some: { slug: topic.slug } },
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in ${totalCount} ${capitalCase(topic.slug)} tools...`}
    />
  )
}
