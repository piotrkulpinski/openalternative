import Link from "next/link"
import { Listing } from "~/components/web/listing"
import { ToolList } from "~/components/web/tools/tool-list"
import type { LicenseOne } from "~/server/licenses/payloads"
import { findTools } from "~/server/tools/queries"

type LicenseToolListingProps = {
  license: LicenseOne
}

export const LicenseToolListing = async ({ license }: LicenseToolListingProps) => {
  const tools = await findTools({ where: { license: { slug: license.slug } }, take: 3 })

  return (
    <Listing
      title={`${license.name} Licensed Software Examples`}
      button={<Link href={`/licenses/${license.slug}/tools`}>View All Tools</Link>}
    >
      <ToolList tools={tools} showAd={false} />
    </Listing>
  )
}
