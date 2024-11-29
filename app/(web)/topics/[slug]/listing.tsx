import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { findAd } from "~/server/ads/queries"
import { searchTools } from "~/server/tools/queries"
import type { TopicOne } from "~/server/topics/payloads"

type TopicToolListingProps = {
  topic: TopicOne
  searchParams: Promise<SearchParams>
}

export const TopicToolListing = async ({ topic, searchParams }: TopicToolListingProps) => {
  const [{ tools, totalCount }, ad] = await Promise.all([
    searchTools(await searchParams, {
      where: { topics: { some: { topic: { slug: topic.slug } } } },
    }),
    findAd({ where: { type: "Homepage" } }),
  ])

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      ad={ad}
      placeholder={`Search in "${topic.slug}"...`}
    />
  )
}
