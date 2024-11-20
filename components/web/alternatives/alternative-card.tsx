import Link from "next/link"
import plur from "plur"
import type { ComponentProps } from "react"
import { H4 } from "~/components/common/heading"
import { Skeleton } from "~/components/common/skeleton"
import { Card } from "~/components/web/ui/card"
import { Favicon } from "~/components/web/ui/favicon"
import type { AlternativeMany } from "~/server/alternatives/payloads"
import { cx } from "~/utils/cva"

type AlternativeCardProps = Omit<ComponentProps<typeof Link>, "href"> & {
  alternative: AlternativeMany
  showCount?: boolean
}

const AlternativeCard = ({ alternative, showCount, ...props }: AlternativeCardProps) => {
  return (
    <Card asChild>
      <Link href={`/alternatives/${alternative.slug}`} {...props}>
        <Card.Header>
          <Favicon
            src={
              alternative.faviconUrl ||
              `https://www.google.com/s2/favicons?sz=128&domain_url=${alternative.website}`
            }
            title={alternative.name}
          />

          <H4 as="h3" className="truncate">
            {alternative.name}
          </H4>
        </Card.Header>

        {alternative.description && (
          <Card.Description className={cx(!showCount && "line-clamp-3")}>
            {alternative.description}
          </Card.Description>
        )}

        {showCount && (
          <Card.Footer>
            {alternative._count.tools} {plur("alternative", alternative._count.tools)}
          </Card.Footer>
        )}
      </Link>
    </Card>
  )
}

const AlternativeCardSkeleton = () => {
  return (
    <Card hover={false} className="items-stretch select-none">
      <Card.Header>
        <Favicon src={null} className="animate-pulse" />

        <H4 className="w-2/3">
          <Skeleton>&nbsp;</Skeleton>
        </H4>
      </Card.Header>

      <Card.Description className="flex flex-col gap-0.5">
        <Skeleton className="h-5 w-4/5">&nbsp;</Skeleton>
        <Skeleton className="h-5 w-1/2">&nbsp;</Skeleton>
      </Card.Description>

      <Card.Footer>
        <Skeleton className="h-4 w-1/3">&nbsp;</Skeleton>
      </Card.Footer>
    </Card>
  )
}

export { AlternativeCard, AlternativeCardSkeleton }
