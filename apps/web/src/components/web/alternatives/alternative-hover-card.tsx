import type { ComponentProps } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/common/hover-card"
import type { AlternativeMany } from "~/server/web/alternatives/payloads"
import { AlternativeCard } from "./alternative-card"

type AlternativeHoverCardProps = ComponentProps<typeof HoverCardTrigger> & {
  alternative: AlternativeMany
}

export const AlternativeHoverCard = ({ alternative, ...props }: AlternativeHoverCardProps) => {
  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild {...props} />

      <HoverCardContent asChild>
        <AlternativeCard alternative={alternative} className="w-80" />
      </HoverCardContent>
    </HoverCard>
  )
}
