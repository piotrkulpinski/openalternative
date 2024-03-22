import { HTMLAttributes } from "react"
import { Card } from "../Card"
import plur from "plur"
import { AlternativeMany } from "~/services.server/api"

type AlternativeRecordProps = HTMLAttributes<HTMLElement> & {
  alternative: AlternativeMany
  showCount?: boolean
}

export const AlternativeRecord = ({ alternative, showCount, ...props }: AlternativeRecordProps) => {
  return (
    <Card
      to={`/alternatives/${alternative.slug}`}
      name={alternative.name}
      description={alternative.description}
      website={alternative.website}
      {...props}
    >
      {showCount && (
        <span className="text-xs text-neutral-500">
          {alternative.tools.length} {plur("alternative", alternative.tools.length)}
        </span>
      )}
    </Card>
  )
}
