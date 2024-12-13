import Link from "next/link"
import plur from "plur"
import type { ComponentProps } from "react"
import { H4 } from "~/components/common/heading"
import { Skeleton } from "~/components/common/skeleton"
import { Card, CardDescription, CardFooter, CardHeader } from "~/components/web/ui/card"
import { Favicon } from "~/components/web/ui/favicon"
import type { AlternativeMany } from "~/server/web/alternatives/payloads"
import { cx } from "~/utils/cva"

type AlternativeCardProps = Omit<ComponentProps<typeof Card>, "href"> & {
  alternative: AlternativeMany
  showCount?: boolean
}

const AlternativeCard = ({ alternative, showCount, ...props }: AlternativeCardProps) => {
  return (
    <Card asChild {...props}>
      <Link href={`/alternatives/${alternative.slug}`} prefetch={false}>
        <CardHeader>
          <Favicon src={alternative.faviconUrl} title={alternative.name} />

          <H4 as="h3" className="truncate">
            {alternative.name}
          </H4>
        </CardHeader>

        {alternative.description && (
          <CardDescription className={cx(!showCount && "line-clamp-3")}>
            {alternative.description}
          </CardDescription>
        )}

        {showCount && (
          <CardFooter>
            {alternative._count.tools} {plur("alternative", alternative._count.tools)}
          </CardFooter>
        )}
      </Link>
    </Card>
  )
}

const AlternativeCardSkeleton = () => {
  return (
    <Card hover={false} className="items-stretch select-none">
      <CardHeader>
        <Favicon src="/favicon.png" className="animate-pulse opacity-50" />

        <H4 className="w-2/3">
          <Skeleton>&nbsp;</Skeleton>
        </H4>
      </CardHeader>

      <CardDescription className="flex flex-col gap-0.5">
        <Skeleton className="h-5 w-4/5">&nbsp;</Skeleton>
        <Skeleton className="h-5 w-1/2">&nbsp;</Skeleton>
      </CardDescription>

      <CardFooter>
        <Skeleton className="h-4 w-1/3">&nbsp;</Skeleton>
      </CardFooter>
    </Card>
  )
}

export { AlternativeCard, AlternativeCardSkeleton }
