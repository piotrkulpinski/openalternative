import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { CategoryOne } from "~/server/web/categories/payloads"
import type { LicenseOne } from "~/server/web/licenses/payloads"
import { searchTools } from "~/server/web/tools/queries"
import { toolsSearchParamsCache } from "~/server/web/tools/search-params"

type CategoryToolListingProps = {
  category: CategoryOne
  license: LicenseOne
  searchParams: Promise<SearchParams>
}

export const CategoryToolListing = async ({
  category,
  license,
  searchParams,
}: CategoryToolListingProps) => {
  const parsedParams = toolsSearchParamsCache.parse(await searchParams)

  const { tools, totalCount } = await searchTools(parsedParams, {
    where: {
      categories: { some: { slug: category.slug } },
      license: { slug: license.slug },
    },
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in ${totalCount} ${category.label} tools licensed under ${license.name}...`}
      lockedFilters={[
        { type: "category", value: category.slug },
        { type: "license", value: license.slug },
      ]}
    />
  )
}
