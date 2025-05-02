import type { ComponentProps } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/common/hover-card"
import type { AlternativeMany } from "~/server/web/alternatives/payloads"
import { AlternativeCard } from "./alternative-card"

type AlternativeHoverCardProps = ComponentProps<typeof HoverCardTrigger> & {
  alternative: AlternativeMany
}

export const AlternativeHoverCard = ({ alternative, ...props }: AlternativeHoverCardProps) => {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild {...props} />

      <HoverCardContent align="start" asChild>
        <AlternativeCard alternative={alternative} showCount />
      </HoverCardContent>
    </HoverCard>
  )
}
