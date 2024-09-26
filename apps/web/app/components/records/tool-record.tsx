import { formatNumber } from "@curiousleaf/utils"
import type { SerializeFrom } from "@remix-run/node"
import { Link, unstable_useViewTransitionState } from "@remix-run/react"
import type { Hit as AlgoliaHit } from "instantsearch.js"
import { GitForkIcon, PercentIcon, SparklesIcon, StarIcon, TimerIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { Highlight } from "react-instantsearch"
import { Badge } from "~/components/ui/badge"
import { Card } from "~/components/ui/card"
import { Favicon } from "~/components/ui/favicon"
import { H4 } from "~/components/ui/heading"
import { Insights } from "~/components/ui/insights"
import { Stack } from "~/components/ui/stack"
import { Tooltip, TooltipProvider } from "~/components/ui/tooltip"
import type { ToolMany } from "~/services.server/api"
import { DAY_IN_MS } from "~/utils/constants"
import { formatDate } from "~/utils/helpers"

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
    { label: "Stars", value: formatNumber(tool.stars, "standard"), icon: StarIcon },
    { label: "Forks", value: formatNumber(tool.forks, "standard"), icon: GitForkIcon },
    {
      label: "Last commit",
      value: tool.lastCommitDate && formatDate(tool.lastCommitDate, { addSuffix: true }),
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

          {tool.publishedAt &&
            new Date(tool.publishedAt).getTime() > Date.now() - DAY_IN_MS * 30 && (
              <Badge variant="success">New</Badge>
            )}

          <TooltipProvider delayDuration={500} disableHoverableContent>
            <Stack size="sm" className="ml-auto flex-nowrap">
              {tool.firstCommitDate &&
                new Date(tool.firstCommitDate).getTime() > Date.now() - DAY_IN_MS * 365 && (
                  <Tooltip tooltip="Repo is less than 1 year old">
                    <SparklesIcon className="text-yellow-500" />
                  </Tooltip>
                )}

              {tool.discountAmount && (
                <Tooltip tooltip="Exclusive discount">
                  <PercentIcon className="text-green-500" />
                </Tooltip>
              )}
            </Stack>
          </TooltipProvider>
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
      classNames={{ highlighted: "bg-primary text-white" }}
    />
  )
}
