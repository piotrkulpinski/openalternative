import type { SerializeFrom } from "@remix-run/node"
import plur from "plur"
import type { HTMLAttributes } from "react"
import { CardSimple } from "~/components/ui/card-simple"
import type { TopicMany } from "~/services.server/api"

type TopicRecordProps = HTMLAttributes<HTMLElement> & {
  topic: SerializeFrom<TopicMany>
}

export const TopicRecord = ({ topic, ...props }: TopicRecordProps) => {
  return (
    <CardSimple
      to={`/topics/${topic.slug}`}
      label={topic.slug}
      caption={`${topic._count.tools} ${plur("tool", topic._count.tools)}`}
      {...props}
    />
  )
}
