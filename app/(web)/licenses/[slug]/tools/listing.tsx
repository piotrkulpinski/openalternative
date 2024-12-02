import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { LicenseOne } from "~/server/licenses/payloads"
import { searchTools } from "~/server/tools/queries"
import { toolsSearchParamsCache } from "~/server/tools/search-params"
type LicenseToolListingProps = {
  license: LicenseOne
  searchParams: Promise<SearchParams>
}

export const LicenseToolListing = async ({ license, searchParams }: LicenseToolListingProps) => {
  const parsedParams = toolsSearchParamsCache.parse(await searchParams)

  const { tools, totalCount } = await searchTools(parsedParams, {
    where: { license: { slug: license.slug } },
  })

  return <ToolQuery tools={tools} totalCount={totalCount} perPage={parsedParams.perPage} />
}
