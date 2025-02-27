import { LicenseList } from "~/components/web/licenses/license-list"
import { findLicenses } from "~/server/web/licenses/queries"

export const LicenseListing = async () => {
  const licenses = await findLicenses({})

  return <LicenseList licenses={licenses} />
}
