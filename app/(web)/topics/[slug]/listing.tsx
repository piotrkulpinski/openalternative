import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { searchTools } from "~/server/tools/queries"
import type { TopicOne } from "~/server/topics/payloads"

type TopicToolListingProps = {
  topic: TopicOne
  searchParams: Promise<SearchParams>
}

export const TopicToolListing = async ({ topic, searchParams }: TopicToolListingProps) => {
  const { tools, totalCount } = await searchTools(await searchParams, {
    where: { topics: { some: { topic: { slug: topic.slug } } } },
  })

  return (
    <ToolQuery tools={tools} totalCount={totalCount} placeholder={`Search in "${topic.slug}"...`} />
  )
}
