import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { LicenseOne } from "~/server/web/licenses/payloads"
import { filterParamsCache } from "~/server/web/shared/schemas"
import { searchTools } from "~/server/web/tools/queries"
type LicenseToolListingProps = {
  license: LicenseOne
  searchParams: Promise<SearchParams>
}

export const LicenseToolListing = async ({ license, searchParams }: LicenseToolListingProps) => {
  const parsedParams = filterParamsCache.parse(await searchParams)

  const { tools, totalCount } = await searchTools(parsedParams, {
    license: { slug: license.slug },
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in ${totalCount} tools licensed under ${license.name}...`}
    />
  )
}
