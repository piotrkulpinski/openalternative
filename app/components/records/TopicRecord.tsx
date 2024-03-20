import { HTMLAttributes } from "react"
import { TopicMany } from "~/services.server/api"
import { CardSimple } from "../CardSimple"

type TopicRecordProps = HTMLAttributes<HTMLElement> & {
  topic: TopicMany
}

export const TopicRecord = ({ topic, ...props }: TopicRecordProps) => {
  return (
    <CardSimple
      to={`/topics/${topic.slug}`}
      label={topic.name}
      caption={`${topic.tools.length} tools`}
      {...props}
    />
  )
}
