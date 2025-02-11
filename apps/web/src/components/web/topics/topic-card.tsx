import plur from "plur"
import type { ComponentProps } from "react"
import { Link } from "~/components/common/link"
import { Skeleton } from "~/components/common/skeleton"
import { Tile, TileCaption, TileDivider, TileTitle } from "~/components/web/ui/tile"
import type { TopicMany } from "~/server/web/topics/payloads"

type TopicCardProps = ComponentProps<typeof Tile> & {
  topic: TopicMany
}

const TopicCard = ({ topic, ...props }: TopicCardProps) => {
  return (
    <Tile asChild {...props}>
      <Link href={`/topics/${topic.slug}`}>
        <TileTitle>{topic.slug}</TileTitle>

        <TileDivider />

        <TileCaption>{`${topic._count.tools} ${plur("tool", topic._count.tools)}`}</TileCaption>
      </Link>
    </Tile>
  )
}

const TopicCardSkeleton = () => {
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

export { TopicCard, TopicCardSkeleton }
