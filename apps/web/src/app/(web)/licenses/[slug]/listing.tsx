import Link from "next/link"
import { Listing } from "~/components/web/listing"
import { ToolList } from "~/components/web/tools/tool-list"
import type { LicenseOne } from "~/server/web/licenses/payloads"
import { findTools } from "~/server/web/tools/queries"

type LicenseToolListingProps = {
  license: LicenseOne
}

export const LicenseToolListing = async ({ license }: LicenseToolListingProps) => {
  const tools = await findTools({ where: { license: { slug: license.slug } }, take: 3 })

  return (
    <Listing
      title={`${license.name} Licensed Software Examples`}
      button={
        <Link href={`/licenses/${license.slug}/tools`} prefetch={false}>
          View All Tools
        </Link>
      }
    >
      <ToolList tools={tools} showAd={false} />
    </Listing>
  )
}
