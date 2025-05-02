import type { ComponentProps } from "react"
import { EmptyList } from "~/components/web/empty-list"
import { TopicCard, TopicCardSkeleton } from "~/components/web/topics/topic-card"
import { Grid } from "~/components/web/ui/grid"
import type { TopicMany } from "~/server/web/topics/payloads"
import { cx } from "~/utils/cva"

type TopicListProps = ComponentProps<typeof Grid> & {
  topics: TopicMany[]
}

const TopicList = ({ topics, className, ...props }: TopicListProps) => {
  return (
    <Grid className={cx("md:gap-8", className)} {...props}>
      {topics.map(topic => (
        <TopicCard key={topic.slug} topic={topic} />
      ))}

      {!topics.length && <EmptyList>No topics found.</EmptyList>}
    </Grid>
  )
}

const TopicListSkeleton = () => {
  return (
    <Grid className="md:gap-8">
      {[...Array(24)].map((_, index) => (
        <TopicCardSkeleton key={index} />
      ))}
    </Grid>
  )
}

export { TopicList, TopicListSkeleton }
