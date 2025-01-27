import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { LicenseOne } from "~/server/web/licenses/payloads"
import { searchTools } from "~/server/web/tools/queries"
import { toolsSearchParamsCache } from "~/server/web/tools/search-params"
type LicenseToolListingProps = {
  license: LicenseOne
  searchParams: Promise<SearchParams>
}

export const LicenseToolListing = async ({ license, searchParams }: LicenseToolListingProps) => {
  const parsedParams = toolsSearchParamsCache.parse(await searchParams)

  const { tools, totalCount } = await searchTools(parsedParams, {
    where: { license: { slug: license.slug } },
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in ${totalCount} tools licensed under ${license.name}...`}
      lockedFilters={[{ type: "license", value: license.slug }]}
    />
  )
}
