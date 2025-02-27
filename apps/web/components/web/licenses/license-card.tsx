import plur from "plur"
import type { ComponentProps } from "react"
import { Link } from "~/components/common/link"
import { Skeleton } from "~/components/common/skeleton"
import { Tile, TileCaption, TileDivider, TileTitle } from "~/components/web/ui/tile"
import type { LicenseMany } from "~/server/web/licenses/payloads"

type LicenseCardProps = ComponentProps<typeof Tile> & {
  license: LicenseMany
}

const LicenseCard = ({ license, ...props }: LicenseCardProps) => {
  return (
    <Tile asChild {...props}>
      <Link href={`/licenses/${license.slug}`}>
        <TileTitle>{license.name}</TileTitle>

        <TileDivider />

        <TileCaption>{`${license._count.tools} ${plur("tool", license._count.tools)}`}</TileCaption>
      </Link>
    </Tile>
  )
}

const LicenseCardSkeleton = () => {
  return (
    <Tile>
      <TileTitle className="w-1/3">
        <Skeleton>&nbsp;</Skeleton>
      </TileTitle>

      <Skeleton className="h-0.5 flex-1" />

      <TileCaption className="w-1/4">
        <Skeleton>&nbsp;</Skeleton>
      </TileCaption>
    </Tile>
  )
}

export { LicenseCard, LicenseCardSkeleton }
