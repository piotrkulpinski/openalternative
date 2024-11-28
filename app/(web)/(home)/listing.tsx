import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { findAd } from "~/server/ads/queries"
import { findCategories } from "~/server/categories/queries"
import { searchTools } from "~/server/tools/queries"

type HomeToolListingProps = {
  searchParams: Promise<SearchParams>
}

export const HomeToolListing = async ({ searchParams }: HomeToolListingProps) => {
  const [{ tools, totalCount }, ad, categories] = await Promise.all([
    searchTools(searchParams, {}),
    findAd({ where: { type: "Homepage" } }),
    findCategories({}),
  ])

  return <ToolQuery tools={tools} totalCount={totalCount} ad={ad} categories={categories} />
}
