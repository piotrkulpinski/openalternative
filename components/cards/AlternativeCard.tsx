import { Series } from "@curiousleaf/design"
import { ComponentPropsWithoutRef } from "react"
import { Card } from "~/components/Card"
import { Alternative } from "~/queries/alternatives"
import { Favicon } from "../Favicon"

type AlternativeCardProps = Omit<ComponentPropsWithoutRef<typeof Card>, "href"> & {
  alternative: Partial<Alternative>
}

export const AlternativeCard = ({ alternative, ...props }: AlternativeCardProps) => {
  return (
    <Card href={`/alternatives-to/${alternative.slug}`} {...props}>
      <Favicon url={alternative.website} />

      <Series direction="column">
        <h2 className="text-lg font-semibold">{alternative.name}</h2>

        <p className="line-clamp-2 text-sm text-gray-600">{alternative.description}</p>
      </Series>
    </Card>
  )
}
