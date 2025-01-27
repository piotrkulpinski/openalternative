import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { CategoryOne } from "~/server/web/categories/payloads"
import type { StackOne } from "~/server/web/stacks/payloads"
import { searchTools } from "~/server/web/tools/queries"
import { toolsSearchParamsCache } from "~/server/web/tools/search-params"

type CategoryToolListingProps = {
  category: CategoryOne
  stack: StackOne
  searchParams: Promise<SearchParams>
}

export const CategoryToolListing = async ({
  category,
  stack,
  searchParams,
}: CategoryToolListingProps) => {
  const parsedParams = toolsSearchParamsCache.parse(await searchParams)

  const { tools, totalCount } = await searchTools(parsedParams, {
    where: {
      categories: { some: { slug: category.slug } },
      stacks: { some: { slug: stack.slug } },
    },
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in ${totalCount} ${category.label} tools using ${stack.name}...`}
      lockedFilters={[
        { type: "category", value: category.slug },
        { type: "stack", value: stack.slug },
      ]}
    />
  )
}
