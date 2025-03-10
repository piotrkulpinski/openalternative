import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { CategoryOne } from "~/server/web/categories/payloads"
import { filterParamsCache } from "~/server/web/shared/schemas"
import type { StackOne } from "~/server/web/stacks/payloads"
import { searchTools } from "~/server/web/tools/queries"

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
  const parsedParams = filterParamsCache.parse(await searchParams)

  const { tools, totalCount } = await searchTools(parsedParams, {
    categories: { some: { slug: category.slug } },
    stacks: { some: { slug: stack.slug } },
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in ${totalCount} ${category.label} tools using ${stack.name}...`}
    />
  )
}
