import { formatDate } from "@curiousleaf/utils"
import { differenceInDays } from "date-fns"
import { BellPlusIcon, ClockIcon, SparklesIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { Stack } from "~/components/common/stack"
import { Tooltip, TooltipProvider } from "~/components/common/tooltip"
import type { ToolMany, ToolOne } from "~/server/web/tools/payloads"
import { cx } from "~/utils/cva"

type ToolBadgesProps = ComponentProps<typeof Stack> & {
  tool: ToolOne | ToolMany
}

export const ToolBadges = ({ tool, children, className, ...props }: ToolBadgesProps) => {
  const { firstCommitDate, publishedAt } = tool

  const commitDiff = firstCommitDate ? differenceInDays(new Date(), firstCommitDate) : null
  const publishedDiff = publishedAt ? differenceInDays(new Date(), publishedAt) : null

  const isNew = commitDiff !== null && commitDiff <= 365
  const isFresh = publishedDiff !== null && publishedDiff <= 30 && publishedDiff >= 0
  const isScheduled = publishedAt !== null && publishedAt > new Date()

  return (
    <TooltipProvider delayDuration={500}>
      <Stack size="sm" wrap={false} className={cx("justify-end text-sm", className)} {...props}>
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
