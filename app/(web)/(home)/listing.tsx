import type { SearchParams } from "nuqs"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { findCategories } from "~/server/categories/queries"
import { searchTools } from "~/server/tools/queries"

type HomeToolListingProps = {
  searchParams: Promise<SearchParams>
}

export const HomeToolListing = async ({ searchParams }: HomeToolListingProps) => {
  const [{ tools, totalCount }, categories] = await Promise.all([
    searchTools(searchParams, {}),
    findCategories({}),
  ])

  return <ToolQuery tools={tools} totalCount={totalCount} categories={categories} />
}
