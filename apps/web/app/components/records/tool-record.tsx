import { formatNumber } from "@curiousleaf/utils"
import type { SerializeFrom } from "@remix-run/node"
import { Link, unstable_useViewTransitionState } from "@remix-run/react"
import { formatDistanceToNowStrict } from "date-fns"
import type { Hit as AlgoliaHit } from "instantsearch.js"
import { GitForkIcon, StarIcon, TimerIcon } from "lucide-react"
import { posthog } from "posthog-js"
import type { HTMLAttributes } from "react"
import { Highlight } from "react-instantsearch"
import { ToolBadges } from "~/components/records/tool-badges"
import { Badge } from "~/components/ui/badge"
import { Card } from "~/components/ui/card"
import { Favicon } from "~/components/ui/favicon"
import { H4 } from "~/components/ui/heading"
import { Insights } from "~/components/ui/insights"
import type { ToolMany } from "~/services.server/api"

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
  const featuredFlag = posthog.getFeatureFlag("featured_badge")?.toString()

  const insights = [
    { label: "Stars", value: formatNumber(tool.stars, "standard"), icon: StarIcon },
    { label: "Forks", value: formatNumber(tool.forks, "standard"), icon: GitForkIcon },
    {
      label: "Last commit",
      value:
        tool.lastCommitDate && formatDistanceToNowStrict(tool.lastCommitDate, { addSuffix: true }),
      icon: TimerIcon,
    },
  ]

  return (
    <Card style={{ viewTransitionName: vt ? `tool-${tool.id}` : undefined }} asChild>
      <Link
        to={to}
        prefetch="intent"
        onClick={() =>
          tool.isFeatured && posthog.capture("featured_tool_clicked", { slug: tool.slug })
        }
        unstable_viewTransition
        {...props}
      >
        {tool.isFeatured && featuredFlag && (
          <>
            {featuredFlag.includes("bg") && <Card.Bg />}

            {featuredFlag.includes("badge") && (
              <Card.Badges>
                <Badge variant="outline">Featured</Badge>
              </Card.Badges>
            )}
          </>
        )}

        <Card.Header>
          <Favicon
            src={tool.faviconUrl}
            title={tool.name}
            style={{ viewTransitionName: vt ? `tool-${tool.id}-favicon` : undefined }}
          />

          <H4
            as="h3"
            className="!leading-snug truncate flex-1"
            style={{ viewTransitionName: vt ? `tool-${tool.id}-name` : undefined }}
          >
            <ToolHighlight tool={tool} attribute="name" />
          </H4>

          <ToolBadges
            tool={tool}
            size="sm"
            className="text-base"
            style={{ viewTransitionName: vt ? `tool-${tool.id}-badges` : undefined }}
          >
            {tool.discountAmount && <Badge variant="success">Get {tool.discountAmount}!</Badge>}
          </ToolBadges>
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
    return <>{String(tool[attribute])}</>
  }

  return (
    <Highlight
      hit={tool as AlgoliaHit<Tool>}
      attribute={attribute}
      classNames={{ highlighted: "bg-primary text-white" }}
    />
  )
}
