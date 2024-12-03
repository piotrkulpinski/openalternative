import type { ComponentProps } from "react"
import { EmptyList } from "~/components/web/empty-list"
import { LicenseCard, LicenseCardSkeleton } from "~/components/web/licenses/license-card"
import { Grid } from "~/components/web/ui/grid"
import type { LicenseMany } from "~/server/web/licenses/payloads"
import { cx } from "~/utils/cva"

type LicenseListProps = ComponentProps<typeof Grid> & {
  licenses: LicenseMany[]
}

const LicenseList = ({ licenses, className, ...props }: LicenseListProps) => {
  return (
    <Grid className={cx("md:gap-8", className)} {...props}>
      {licenses.map(license => (
        <LicenseCard key={license.slug} license={license} />
      ))}

      {!licenses.length && <EmptyList>No licenses found.</EmptyList>}
    </Grid>
  )
}

const LicenseListSkeleton = () => {
  return (
    <Grid className="md:gap-8">
      {[...Array(12)].map((_, index) => (
        <LicenseCardSkeleton key={index} />
      ))}
    </Grid>
  )
}

export { LicenseList, LicenseListSkeleton }
