import { Link } from "~/components/common/link"
import { Listing } from "~/components/web/listing"
import { ToolList } from "~/components/web/tools/tool-list"
import type { LicenseOne } from "~/server/web/licenses/payloads"
import { findTools } from "~/server/web/tools/queries"

type LicenseToolListingProps = {
  license: LicenseOne
  count?: number
}

export const LicenseToolListing = async ({ license, count = 3 }: LicenseToolListingProps) => {
  const tools = await findTools({ where: { license: { slug: license.slug } }, take: count })

  return (
    <Listing
      title="Best examples:"
      button={<Link href={`/licenses/${license.slug}/tools`}>View All Tools</Link>}
    >
      <ToolList tools={tools} showAd={false} />
    </Listing>
  )
}
