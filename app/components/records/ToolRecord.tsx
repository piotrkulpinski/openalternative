import type { SerializeFrom } from "@remix-run/node"
import { NavLink } from "@remix-run/react"
import type { Hit as AlgoliaHit } from "instantsearch.js"
import { GitForkIcon, StarIcon, TimerIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { Highlight } from "react-instantsearch"
import { format } from "timeago.js"
import type { ToolMany } from "~/services.server/api"
import { cx } from "~/utils/cva"
import { Card } from "../Card"
import { Favicon } from "../Favicon"
import { H4 } from "../Heading"
import { Insights } from "../Insights"

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
      className={cx("group flex", className)}
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
              style={isTransitioning ? { viewTransitionName: "tool-favicon" } : undefined}
            />

            <H4
              as="h3"
              className="truncate"
              style={isTransitioning ? { viewTransitionName: "tool-title" } : undefined}
            >
              <ToolHighlight tool={tool} attribute="name" />
            </H4>
          </Card.Header>

          {tool.description && (
            <Card.Description
              style={isTransitioning ? { viewTransitionName: "tool-description" } : undefined}
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
