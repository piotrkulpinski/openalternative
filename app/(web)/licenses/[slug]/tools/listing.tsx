import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { findAd } from "~/server/ads/queries"
import type { LicenseOne } from "~/server/licenses/payloads"
import { searchTools } from "~/server/tools/queries"

type LicenseToolListingProps = {
  license: LicenseOne
  searchParams: Promise<SearchParams>
}

export const LicenseToolListing = async ({ license, searchParams }: LicenseToolListingProps) => {
  const [{ tools, totalCount }, ad] = await Promise.all([
    searchTools(searchParams, {
      where: { license: { slug: license.slug } },
    }),
    findAd({ where: { type: "Homepage" } }),
  ])

  return <ToolQuery tools={tools} totalCount={totalCount} ad={ad} />
}
