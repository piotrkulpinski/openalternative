import type { SerializeFrom } from "@remix-run/node"
import { NavLink } from "@remix-run/react"
import { Card } from "apps/web/app/components/Card"
import { Favicon } from "apps/web/app/components/Favicon"
import { H4 } from "apps/web/app/components/Heading"
import type { AlternativeMany } from "apps/web/app/services.server/api"
import { cx } from "apps/web/app/utils/cva"
import plur from "plur"
import type { HTMLAttributes } from "react"

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
