import { formatDate } from "@curiousleaf/utils"
import { differenceInDays } from "date-fns"
import { BellPlusIcon, ClockIcon, SparklesIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { Stack } from "~/components/common/stack"
import { Tooltip, TooltipProvider } from "~/components/web/ui/tooltip"
import type { ToolMany, ToolManyExtended } from "~/server/web/tools/payloads"
import { cx } from "~/utils/cva"

type ToolBadgesProps = HTMLAttributes<HTMLElement> & {
  tool: ToolMany | ToolManyExtended
  size?: "sm" | "md"
}

export const ToolBadges = ({ tool, size, children, className, ...props }: ToolBadgesProps) => {
  const { firstCommitDate, publishedAt } = tool
  const now = new Date().toISOString()

  const commitDiff = firstCommitDate ? differenceInDays(new Date(now), firstCommitDate) : null
  const publishedDiff = publishedAt ? differenceInDays(new Date(now), publishedAt) : null

  const isNew = commitDiff !== null && commitDiff <= 365
  const isFresh = publishedDiff !== null && publishedDiff <= 30 && publishedDiff >= 0
  const isScheduled = publishedAt !== null && publishedAt > new Date(now)

  return (
    <TooltipProvider delayDuration={500} disableHoverableContent>
      <Stack size={size} className={cx("flex-nowrap justify-end text-lg", className)} {...props}>
        {isNew && (
          <Tooltip tooltip="Repo is less than 1 year old">
            <SparklesIcon className="text-yellow-500" />
          </Tooltip>
        )}

        {isFresh && (
          <Tooltip tooltip="Published in the last 30 days">
            <BellPlusIcon className="text-green-500" />
          </Tooltip>
        )}

        {isScheduled && (
          <Tooltip tooltip={`Scheduled for ${formatDate(publishedAt)}`}>
            <ClockIcon className="text-yellow-500" />
          </Tooltip>
        )}

        {children}
      </Stack>
    </TooltipProvider>
  )
}
