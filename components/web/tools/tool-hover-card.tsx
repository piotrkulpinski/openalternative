import type { ComponentProps } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/common/hover-card"
import type { ToolMany } from "~/server/web/tools/payloads"
import { ToolCard } from "./tool-card"

type ToolHoverCardProps = ComponentProps<typeof HoverCardTrigger> & {
  tool: ToolMany
}

export const ToolHoverCard = ({ tool, ...props }: ToolHoverCardProps) => {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild {...props} />

      <HoverCardContent align="start" className="max-w-72" asChild>
        <ToolCard tool={tool} />
      </HoverCardContent>
    </HoverCard>
  )
}
