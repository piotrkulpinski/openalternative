import { HTMLAttributes } from "react"
import plur from "plur"
import { TopicMany } from "~/services.server/api"
import { CardSimple } from "~/components/CardSimple"
import { SerializeFrom } from "@remix-run/node"

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
