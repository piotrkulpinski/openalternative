import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { LicenseOne } from "~/server/licenses/payloads"
import { searchTools } from "~/server/tools/queries"

type LicenseToolListingProps = {
  license: LicenseOne
  searchParams: Promise<SearchParams>
}

export const LicenseToolListing = async ({ license, searchParams }: LicenseToolListingProps) => {
  const { tools, totalCount } = await searchTools(await searchParams, {
    where: { license: { slug: license.slug } },
  })

  return <ToolQuery tools={tools} totalCount={totalCount} />
}
