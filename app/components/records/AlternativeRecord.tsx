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
          <Favicon
            src={`https://www.google.com/s2/favicons?sz=128&domain_url=${alternative.website}`}
            title={alternative.name}
          />

          <H3 className="truncate">{alternative.name}</H3>
        </Card.Header>

        {alternative.description && (
          <p className="-tracking-0.5 line-clamp-2 text-sm/normal text-neutral-600 dark:text-neutral-400">
            {alternative.description}
          </p>
        )}

        {showCount && (
          <span className="text-xs text-neutral-500">
            {alternative._count.tools} {plur("alternative", alternative._count.tools)}
          </span>
        )}
      </NavLink>
    </Card>
  )
}
