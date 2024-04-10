import { type SerializeFrom } from "@remix-run/node"
import { NavLink } from "@remix-run/react"
import { Hit as AlgoliaHit } from "instantsearch.js"
import { Highlight } from "react-instantsearch"
import { GitForkIcon, StarIcon, TimerIcon } from "lucide-react"
import { HTMLAttributes } from "react"
import { format } from "timeago.js"
import { Card } from "../Card"
import { Insights } from "../Insights"
import { ToolMany } from "~/services.server/api"
import { H3 } from "../Heading"
import { Favicon } from "../Favicon"
import { Badge } from "../Badge"
import { cx } from "~/utils/cva"

type Tool = ToolMany | SerializeFrom<ToolMany>

type ToolRecordProps = HTMLAttributes<HTMLElement> & {
  tool: Tool
}

export const ToolRecord = ({ className, tool, ...props }: ToolRecordProps) => {
  const insights = [
    { label: "Stars", value: tool.stars.toLocaleString(), icon: StarIcon },
    { label: "Forks", value: tool.forks.toLocaleString(), icon: GitForkIcon },
    {
      label: "Last commit",
      value: tool.lastCommitDate && format(tool.lastCommitDate),
      icon: TimerIcon,
    },
  ]

  return (
    <NavLink
      to={`/${tool.slug}`}
      className={cx("group", className)}
      prefetch="intent"
      unstable_viewTransition
      {...props}
    >
      {({ isTransitioning }) => (
        <Card style={isTransitioning ? { viewTransitionName: "tool" } : undefined}>
          <Card.Header>
            <Favicon
              src={tool.faviconUrl}
              title={tool.name}
              style={isTransitioning ? { viewTransitionName: `tool-favicon` } : undefined}
            />

            <H3
              className="truncate"
              style={isTransitioning ? { viewTransitionName: `tool-title` } : undefined}
            >
              <ToolHighlight tool={tool} attribute="name" />
            </H3>

            {tool.isFeatured && <Badge className="ml-auto">Promoted</Badge>}
          </Card.Header>

          {tool.description && (
            <Card.Description
              style={isTransitioning ? { viewTransitionName: `tool-description` } : undefined}
            >
              <ToolHighlight tool={tool} attribute="description" />
            </Card.Description>
          )}

          <Insights insights={insights} className="mt-auto" />
        </Card>
      )}
    </NavLink>
  )
}

const ToolHighlight = ({ tool, attribute }: { tool: Tool; attribute: keyof Tool }) => {
  if (!(tool as AlgoliaHit<Tool>)._highlightResult) {
    return <>{tool[attribute]}</>
  }

  return (
    <Highlight
      hit={tool as AlgoliaHit<Tool>}
      attribute={attribute}
      classNames={{ highlighted: "bg-pink-600 text-white" }}
    />
  )
}
