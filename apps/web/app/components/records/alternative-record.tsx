import type { SerializeFrom } from "@remix-run/node"
import { NavLink } from "@remix-run/react"
import plur from "plur"
import type { HTMLAttributes } from "react"
import { Card } from "~/components/ui/card"
import { Favicon } from "~/components/ui/favicon"
import { H4 } from "~/components/ui/heading"
import type { AlternativeMany } from "~/services.server/api"
import { cx } from "~/utils/cva"

type AlternativeRecordProps = HTMLAttributes<HTMLElement> & {
  alternative: SerializeFrom<AlternativeMany>
  showCount?: boolean
}

export const AlternativeRecord = ({ alternative, showCount, ...props }: AlternativeRecordProps) => {
  return (
    <Card asChild>
      <NavLink to={`/alternatives/${alternative.slug}`} unstable_viewTransition {...props}>
        <Card.Header>
          <Favicon
            src={
              alternative.faviconUrl ||
              `https://www.google.com/s2/favicons?sz=128&domain_url=${alternative.website}`
            }
            title={alternative.name}
          />

          <H4 as="h3" className="truncate">
            {alternative.name}
          </H4>
        </Card.Header>

        {alternative.description && (
          <Card.Description className={cx(!showCount && "line-clamp-3")}>
            {alternative.description}
          </Card.Description>
        )}

        {showCount && (
          <Card.Footer>
            {alternative._count.tools} {plur("alternative", alternative._count.tools)}
          </Card.Footer>
        )}
      </NavLink>
    </Card>
  )
}
