import { HTMLAttributes } from "react"
import { AlternativeMany } from "~/services.server/api"
import { Card } from "../Card"

type AlternativeRecordProps = HTMLAttributes<HTMLElement> & {
  alternative: AlternativeMany
}

export const AlternativeRecord = ({ alternative, ...props }: AlternativeRecordProps) => {
  return (
    <Card
      to={`/alternatives/${alternative.slug}`}
      name={alternative.name}
      description={alternative.description}
      website={alternative.website}
      {...props}
    />
  )
}
