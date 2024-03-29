import { GitForkIcon, StarIcon, TimerIcon } from "lucide-react"
import { HTMLAttributes } from "react"
import { format } from "timeago.js"
import { Card } from "../Card"
import { Insights } from "../Insights"
import { ToolMany } from "~/services.server/api"
import { SerializeFrom } from "@remix-run/node"
import { NavLink } from "@remix-run/react"
import { H3 } from "../Heading"
import { Favicon } from "../Favicon"

type ToolRecordProps = HTMLAttributes<HTMLElement> & {
  tool: SerializeFrom<ToolMany>
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
              style={isTransitioning ? { viewTransitionName: `tool-favicon` } : undefined}
            />

            <H3
              className="truncate"
              style={isTransitioning ? { viewTransitionName: `tool-title` } : undefined}
            >
              {tool.name}
            </H3>

            {tool.isFeatured && (
              <div className="ml-auto rounded bg-neutral-200/60 px-1.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-700/60 dark:text-neutral-200">
                Promoted
              </div>
            )}
          </Card.Header>

          {tool.description && (
            <p
              className="-tracking-0.5 line-clamp-2 text-sm/normal text-neutral-500"
              style={isTransitioning ? { viewTransitionName: `tool-description` } : undefined}
            >
              {tool.description}
            </p>
          )}

          <Insights insights={insights} className="mt-auto" />
        </Card>
      )}
    </NavLink>
  )
}
