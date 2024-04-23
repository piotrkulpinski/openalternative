import { HTMLAttributes } from "react"
import { Card } from "~/components/Card"
import plur from "plur"
import { AlternativeMany } from "~/services.server/api"
import { SerializeFrom } from "@remix-run/node"
import { NavLink } from "@remix-run/react"
import { Favicon } from "../Favicon"
import { H3 } from "../Heading"

type AlternativeRecordProps = HTMLAttributes<HTMLElement> & {
  alternative: SerializeFrom<AlternativeMany>
  showCount?: boolean
}

export const AlternativeRecord = ({ alternative, showCount, ...props }: AlternativeRecordProps) => {
  return (
    <Card asChild>
      <NavLink to={`/alternatives/${alternative.slug}`} unstable_viewTransition {...props}>
        <Card.Header>
          <Favicon src={alternative.faviconUrl} title={alternative.name} />

          <H3 className="truncate">{alternative.name}</H3>
        </Card.Header>

        {alternative.description && <Card.Description>{alternative.description}</Card.Description>}

        {showCount && (
          <span className="text-xs text-secondary">
            {alternative._count.tools} {plur("alternative", alternative._count.tools)}
          </span>
        )}
      </NavLink>
    </Card>
  )
}
