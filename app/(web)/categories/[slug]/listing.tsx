import type { SearchParams } from "nuqs"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { findAd } from "~/server/ads/queries"
import type { CategoryOne } from "~/server/categories/payloads"
import { searchTools } from "~/server/tools/queries"

type CategoryToolListingProps = {
  category: CategoryOne
  searchParams: Promise<SearchParams>
}

export const CategoryToolListing = async ({ category, searchParams }: CategoryToolListingProps) => {
  const [{ tools, totalCount }, ad] = await Promise.all([
    searchTools(searchParams, {
      where: { categories: { some: { category: { slug: category.slug } } } },
    }),
    findAd({ where: { type: "Homepage" } }),
  ])

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      ad={ad}
      placeholder={`Search in ${category.label?.toLowerCase()}...`}
    />
  )
}
