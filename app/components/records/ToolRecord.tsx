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
import { Shimmer } from "../Shimmer"
import { Badge } from "../Badge"

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
              title={tool.name}
              style={isTransitioning ? { viewTransitionName: `tool-favicon` } : undefined}
            />

            <H3
              className="truncate"
              style={isTransitioning ? { viewTransitionName: `tool-title` } : undefined}
            >
              {tool.name}
            </H3>

            {tool.isFeatured && <Badge className="ml-auto">Promoted</Badge>}
          </Card.Header>

          {tool.description && (
            <p
              className="-tracking-0.5 line-clamp-2 text-sm/normal text-neutral-600 dark:text-neutral-400"
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

export const ToolRecordSkeleton = ({ ...props }: HTMLAttributes<HTMLElement>) => {
  const insights = [
    { label: "Stars", value: "", icon: StarIcon },
    { label: "Forks", value: "", icon: GitForkIcon },
    { label: "Last commit", value: "", icon: TimerIcon },
  ]

  return (
    <Card className="pointer-events-none" {...props}>
      <Card.Header>
        <Favicon src={null} />

        <H3 className="w-2/3 rounded bg-current opacity-10">&nbsp;</H3>
      </Card.Header>

      <div className="w-full space-y-1">
        <div className="h-5 w-full rounded bg-current opacity-5" />
        <div className="h-5 w-2/3 rounded bg-current opacity-5" />
      </div>

      <Insights insights={insights} className="opacity-50" />
      <Shimmer />
    </Card>
  )
}
