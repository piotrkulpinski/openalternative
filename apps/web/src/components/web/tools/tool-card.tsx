import { formatNumber } from "@curiousleaf/utils"
import { formatDistanceToNowStrict } from "date-fns"
import { GitForkIcon, StarIcon, TimerIcon } from "lucide-react"
import Link from "next/link"
import type { ComponentProps } from "react"
import { H4 } from "~/components/common/heading"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import { ToolBadges } from "~/components/web/tools/tool-badges"
import { Badge } from "~/components/web/ui/badge"
import { Card, CardDescription, CardHeader } from "~/components/web/ui/card"
import { Favicon } from "~/components/web/ui/favicon"
import { Insights } from "~/components/web/ui/insights"
import type { ToolMany } from "~/server/web/tools/payloads"

type ToolCardProps = ComponentProps<typeof Card> & {
  tool: ToolMany

  /**
   * Disables the view transition.
   */
  isRelated?: boolean
}

const ToolCard = ({ className, tool, isRelated, ...props }: ToolCardProps) => {
  const insights = [
    { label: "Stars", value: formatNumber(tool.stars, "standard"), icon: <StarIcon /> },
    { label: "Forks", value: formatNumber(tool.forks, "standard"), icon: <GitForkIcon /> },
    {
      label: "Last commit",
      value:
        tool.lastCommitDate && formatDistanceToNowStrict(tool.lastCommitDate, { addSuffix: true }),
      icon: <TimerIcon />,
    },
  ]

  return (
    <Card asChild {...props}>
      <Link href={`/${tool.slug}`} prefetch={false} className="group">
        <CardHeader>
          <Favicon src={tool.faviconUrl} title={tool.name} />

          <H4 as="h3" className="truncate">
            {tool.name}
          </H4>

          <ToolBadges tool={tool} size="sm" className="ml-auto text-base">
            {tool.discountAmount && <Badge variant="success">Get {tool.discountAmount}!</Badge>}
          </ToolBadges>
        </CardHeader>

        <div className="relative size-full flex flex-col">
          <Stack
            size="lg"
            direction="column"
            className="items-stretch absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
          >
            {tool.description && (
              <CardDescription className="line-clamp-4">{tool.description}</CardDescription>
            )}

            {!!tool.alternatives.length && (
              <Stack className="mt-auto text-sm">
                <span>
                  <span className="sr-only">Open Source </span>Alternative to:
                </span>

                {tool.alternatives.map(({ slug, name, faviconUrl }) => (
                  <Stack size="xs" key={slug}>
                    <Favicon src={faviconUrl} title={name} className="size-6 p-[3px]" />
                    <strong className="font-medium">{name}</strong>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>

          <Stack
            size="lg"
            direction="column"
            className="flex-1 transition-opacity duration-200 group-hover:opacity-0"
          >
            {tool.tagline && <CardDescription>{tool.tagline}</CardDescription>}
            <Insights insights={insights} className="mt-auto" />
          </Stack>
        </div>
      </Link>
    </Card>
  )
}

const ToolCardSkeleton = () => {
  const insights = [
    { label: "Stars", value: <Skeleton className="h-4 w-16" />, icon: <StarIcon /> },
    { label: "Forks", value: <Skeleton className="h-4 w-14" />, icon: <GitForkIcon /> },
    { label: "Last commit", value: <Skeleton className="h-4 w-20" />, icon: <TimerIcon /> },
  ]

  return (
    <Card hover={false} className="items-stretch select-none">
      <CardHeader>
        <Favicon src="/favicon.png" className="animate-pulse opacity-50" />

        <H4 className="w-2/3">
          <Skeleton>&nbsp;</Skeleton>
        </H4>
      </CardHeader>

      <CardDescription className="flex flex-col gap-0.5">
        <Skeleton className="h-5 w-4/5">&nbsp;</Skeleton>
        <Skeleton className="h-5 w-1/2">&nbsp;</Skeleton>
      </CardDescription>

      <Stack size="sm">
        <Insights insights={insights} className="mt-auto animate-pulse" />
      </Stack>
    </Card>
  )
}

export { ToolCard, ToolCardSkeleton }
