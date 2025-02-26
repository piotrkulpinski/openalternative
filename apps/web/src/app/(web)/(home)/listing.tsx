import { type SearchParams, createLoader, parseAsArrayOf, parseAsString } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { searchTools } from "~/server/web/tools/queries"
import { toolsSearchParams } from "~/server/web/tools/schemas"

type HomeToolListingProps = {
  searchParams: Promise<SearchParams>
}

export const HomeToolListing = async ({ searchParams }: HomeToolListingProps) => {
  const loadSearchParams = createLoader({
    ...toolsSearchParams,
    alternative: parseAsArrayOf(parseAsString).withDefault([]),
    category: parseAsArrayOf(parseAsString).withDefault([]),
    stack: parseAsArrayOf(parseAsString).withDefault([]),
    license: parseAsArrayOf(parseAsString).withDefault([]),
  })

  const { alternative, category, stack, license, ...params } = await loadSearchParams(
    await searchParams,
  )

  const { tools, totalCount } = await searchTools(params, {
    where: {
      ...(alternative.length && { alternatives: { some: { slug: { in: alternative } } } }),
      ...(category.length && { categories: { some: { slug: { in: category } } } }),
      ...(stack.length && { stacks: { some: { slug: { in: stack } } } }),
      ...(license.length && { license: { slug: { in: license } } }),
    },
  })

  return <ToolQuery tools={tools} totalCount={totalCount} perPage={params.perPage} enableFilters />
}
