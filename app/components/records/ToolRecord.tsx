import type { SerializeFrom } from "@remix-run/node"
import { Link, unstable_useViewTransitionState } from "@remix-run/react"
import type { Hit as AlgoliaHit } from "instantsearch.js"
import { GitForkIcon, StarIcon, TimerIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { Highlight } from "react-instantsearch"
import { format } from "timeago.js"
import type { ToolMany } from "~/services.server/api"
import { Card } from "../Card"
import { Favicon } from "../Favicon"
import { H4 } from "../Heading"
import { Insights } from "../Insights"

type Tool = ToolMany | SerializeFrom<ToolMany>

type ToolRecordProps = HTMLAttributes<HTMLElement> & {
  tool: Tool

  /**
   * Disables the view transition.
   */
  isRelated?: boolean
}

export const ToolRecord = ({ className, tool, isRelated, ...props }: ToolRecordProps) => {
  const to = `/${tool.slug}`
  const vt = !isRelated && unstable_useViewTransitionState(to)

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
    <Card style={{ viewTransitionName: vt ? `tool-${tool.id}` : undefined }} asChild>
      <Link to={to} prefetch="intent" unstable_viewTransition {...props}>
        <Card.Header>
          <Favicon
            src={tool.faviconUrl}
            title={tool.name}
            style={{ viewTransitionName: vt ? `tool-${tool.id}-favicon` : undefined }}
          />

          <H4
            as="h3"
            className="!leading-snug truncate"
            style={{ viewTransitionName: vt ? `tool-${tool.id}-name` : undefined }}
          >
            <ToolHighlight tool={tool} attribute="name" />
          </H4>
        </Card.Header>

        {tool.description && (
          <Card.Description
            style={{ viewTransitionName: vt ? `tool-${tool.id}-description` : undefined }}
          >
            <ToolHighlight tool={tool} attribute="tagline" />
          </Card.Description>
        )}

        {tool.screenshotUrl && (
          <div
            className="-mt-4 w-full"
            style={{ viewTransitionName: vt ? `tool-${tool.id}-screenshot` : undefined }}
          />
        )}

        {tool.content && (
          <div
            className="-mt-4 w-full"
            style={{ viewTransitionName: vt ? `tool-${tool.id}-content` : undefined }}
          />
        )}

        <Insights insights={insights} className="mt-auto" />
      </Link>
    </Card>
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
