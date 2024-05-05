import type { SerializeFrom } from "@remix-run/node"
import { NavLink } from "@remix-run/react"
import plur from "plur"
import type { HTMLAttributes } from "react"
import { Card } from "~/components/Card"
import type { AlternativeMany } from "~/services.server/api"
import { Favicon } from "../Favicon"
import { H4 } from "../Heading"

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

          <H4 as="h3" className="truncate">
            {alternative.name}
          </H4>
        </Card.Header>

        {alternative.description && <Card.Description>{alternative.description}</Card.Description>}

        {showCount && (
          <Card.Footer>
            {alternative._count.tools} {plur("alternative", alternative._count.tools)}
          </Card.Footer>
        )}
      </NavLink>
    </Card>
  )
}
