import Link from "next/link"
import plur from "plur"
import type { ComponentProps } from "react"
import { Skeleton } from "~/components/common/skeleton"
import {
  CardSimple,
  CardSimpleCaption,
  CardSimpleDivider,
  CardSimpleTitle,
} from "~/components/web/ui/card-simple"
import type { LicenseMany } from "~/server/web/licenses/payloads"

type LicenseCardProps = ComponentProps<typeof CardSimple> & {
  license: LicenseMany
}

const LicenseCard = ({ license, ...props }: LicenseCardProps) => {
  return (
    <CardSimple asChild {...props}>
      <Link href={`/licenses/${license.slug}`} prefetch={false}>
        <CardSimpleTitle>{license.name}</CardSimpleTitle>

        <CardSimpleDivider />

        <CardSimpleCaption>
          {`${license._count.tools} ${plur("tool", license._count.tools)}`}
        </CardSimpleCaption>
      </Link>
    </CardSimple>
  )
}

const LicenseCardSkeleton = () => {
  return (
    <CardSimple>
      <CardSimpleTitle className="w-1/3">
        <Skeleton>&nbsp;</Skeleton>
      </CardSimpleTitle>

      <Skeleton className="h-0.5 flex-1" />

      <CardSimpleCaption className="w-1/4">
        <Skeleton>&nbsp;</Skeleton>
      </CardSimpleCaption>
    </CardSimple>
  )
}

export { LicenseCard, LicenseCardSkeleton }
