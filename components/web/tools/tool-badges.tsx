import { differenceInDays } from "date-fns"
import { BellPlusIcon, SparklesIcon } from "lucide-react"
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
  const { firstCommitDate, publishedAt, updatedAt } = tool

  const commitDifference = firstCommitDate ? differenceInDays(updatedAt, firstCommitDate) : null
  const publishedDifference = publishedAt ? differenceInDays(updatedAt, publishedAt) : null

  const isNew = !!commitDifference && commitDifference <= 365
  const isFresh = !!publishedDifference && publishedDifference <= 30 && publishedDifference >= 0

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

        {children}
      </Stack>
    </TooltipProvider>
  )
}
