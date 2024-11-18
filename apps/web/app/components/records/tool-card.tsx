import { formatNumber } from "@curiousleaf/utils"
import type { SerializeFrom } from "@remix-run/node"
import { Link, unstable_useViewTransitionState } from "@remix-run/react"
import { StarIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { Badge } from "~/components/ui/badge"
import { Card } from "~/components/ui/card"
import { FaviconImage } from "~/components/ui/favicon"
import { Stack } from "~/components/ui/stack"
import type { ToolMany } from "~/services.server/api"
import { cx } from "~/utils/cva"

type ToolCardProps = ComponentProps<typeof Card> & {
  tool: ToolMany | SerializeFrom<ToolMany>

  /**
   * Disables the view transition.
   */
  isRelated?: boolean
}

export const ToolCard = ({ className, tool, isRelated, ...props }: ToolCardProps) => {
  const to = `/${tool.slug}`
  const vt = !isRelated && unstable_useViewTransitionState(to)

  return (
    <Card
      className={cx("py-3 !gap-2", className)}
      isRevealed={false}
      style={{ viewTransitionName: vt ? `tool-${tool.id}` : undefined }}
      asChild
      {...props}
    >
      <Link to={to} prefetch="intent" unstable_viewTransition>
        <Stack size="sm" className="justify-between w-full">
          <Stack size="sm" className="flex-nowrap">
            <FaviconImage
              src={tool.faviconUrl}
              className="size-5"
              style={{ viewTransitionName: vt ? `tool-${tool.id}-favicon` : undefined }}
            />

            <span
              className="font-medium"
              style={{ viewTransitionName: vt ? `tool-${tool.id}-name` : undefined }}
            >
              {tool.name}
            </span>
          </Stack>

          <Badge variant="outline" prefix={<StarIcon />} className="tabular-nums">
            {formatNumber(tool.stars, "standard")}
          </Badge>
        </Stack>

        <span className="w-full text-sm text-muted truncate">{tool.tagline}</span>
      </Link>
    </Card>
  )
}
