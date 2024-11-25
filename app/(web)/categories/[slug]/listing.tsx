import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { CategoryOne } from "~/server/categories/payloads"
import { searchTools } from "~/server/tools/queries"

type CategoryToolListingProps = {
  category: CategoryOne
  searchParams: Promise<SearchParams>
}

export const CategoryToolListing = async ({ category, searchParams }: CategoryToolListingProps) => {
  const { tools, totalCount } = await searchTools(await searchParams, {
    where: { categories: { some: { category: { slug: category.slug } } } },
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      placeholder={`Search in ${category.label?.toLowerCase()}...`}
    />
  )
}
