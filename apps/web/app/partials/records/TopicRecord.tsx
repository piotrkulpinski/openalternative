import type { SerializeFrom } from "@remix-run/node"
import { CardSimple } from "apps/web/app/components/CardSimple"
import type { TopicMany } from "apps/web/app/services.server/api"
import plur from "plur"
import type { HTMLAttributes } from "react"

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
