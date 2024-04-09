import { type SerializeFrom } from "@remix-run/node"
import { Hit as AlgoliaHit } from "instantsearch.js"
import { Highlight } from "react-instantsearch"
import { GitForkIcon, StarIcon, TimerIcon } from "lucide-react"
import { HTMLAttributes } from "react"
import { format } from "timeago.js"
import { Card } from "../Card"
import { Insights } from "../Insights"
import { ToolMany, ToolOne } from "~/services.server/api"
import { NavLink } from "@remix-run/react"
import { H3 } from "../Heading"
import { Favicon } from "../Favicon"
import { Badge } from "../Badge"

type Tool = ToolMany | SerializeFrom<ToolMany>

type ToolRecordProps = HTMLAttributes<HTMLElement> & {
  tool: Tool
}

export const ToolRecord = ({ tool, ...props }: ToolRecordProps) => {
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
      className="contents"
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
            <p
              className="-tracking-0.5 line-clamp-2 text-sm/normal text-neutral-600 dark:text-neutral-400"
              style={isTransitioning ? { viewTransitionName: `tool-description` } : undefined}
            >
              <ToolHighlight tool={tool} attribute="name" />
              {(tool as AlgoliaHit<ToolOne>)._highlightResult ? (
                <Highlight
                  hit={tool as AlgoliaHit<ToolOne>}
                  attribute="description"
                  classNames={{ highlighted: "bg-pink-600 text-white" }}
                />
              ) : (
                tool.description
              )}
            </p>
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
