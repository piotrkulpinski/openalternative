import { HTMLAttributes } from "react"
import plur from "plur"
import { TopicMany } from "~/services.server/api"
import { CardSimple } from "~/components/CardSimple"

type TopicRecordProps = HTMLAttributes<HTMLElement> & {
  topic: TopicMany
}

export const TopicRecord = ({ topic, ...props }: TopicRecordProps) => {
  return (
    <CardSimple
      to={`/topics/${topic.slug}`}
      label={topic.name}
      caption={`${topic._count.tools} ${plur("tool", topic._count.tools)}`}
      {...props}
    />
  )
}
