import { HTMLAttributes } from "react"
import { Card } from "~/components/Card"
import plur from "plur"
import { AlternativeMany } from "~/services.server/api"
import { SerializeFrom } from "@remix-run/node"

type AlternativeRecordProps = HTMLAttributes<HTMLElement> & {
  alternative: SerializeFrom<AlternativeMany>
  showCount?: boolean
}

export const AlternativeRecord = ({ alternative, showCount, ...props }: AlternativeRecordProps) => {
  return (
    <Card
      to={`/alternatives/${alternative.slug}`}
      name={alternative.name}
      description={alternative.description}
      faviconUrl={`https://www.google.com/s2/favicons?sz=128&domain_url=${alternative.website}`}
      {...props}
    >
      {showCount && (
        <span className="text-xs text-neutral-500">
          {alternative._count.tools} {plur("alternative", alternative._count.tools)}
        </span>
      )}
    </Card>
  )
}
