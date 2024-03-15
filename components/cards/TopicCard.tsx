import { Card } from "~/components/Card"
import { ComponentPropsWithoutRef } from "react"
import { Topic } from "~/queries/topics"

type TopicCardProps = Omit<ComponentPropsWithoutRef<typeof Card>, "href"> & {
  topic: Partial<Topic>
}

export const TopicCard = ({ topic, ...props }: TopicCardProps) => {
  const count = topic.tools?.length || 0

  return (
    <Card href={`/topic/${topic.slug}`} {...props}>
      <div className="flex w-full items-center justify-between gap-3">
        <h2 className="flex-1 truncate text-lg font-semibold">{topic.name}</h2>
        <strong className="mr-0.5 text-gray-400">{count}</strong>
      </div>
    </Card>
  )
}
