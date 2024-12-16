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
import type { TopicMany } from "~/server/web/topics/payloads"

type TopicCardProps = ComponentProps<typeof CardSimple> & {
  topic: TopicMany
}

const TopicCard = ({ topic, ...props }: TopicCardProps) => {
  return (
    <CardSimple asChild {...props}>
      <Link href={`/topics/${topic.slug}`} prefetch={false}>
        <CardSimpleTitle>{topic.slug}</CardSimpleTitle>

        <CardSimpleDivider />

        <CardSimpleCaption>
          {`${topic._count.tools} ${plur("tool", topic._count.tools)}`}
        </CardSimpleCaption>
      </Link>
    </CardSimple>
  )
}

const TopicCardSkeleton = () => {
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

export { TopicCard, TopicCardSkeleton }
