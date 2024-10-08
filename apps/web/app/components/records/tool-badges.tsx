import { Stack } from "~/components/ui/stack"
import type { ToolMany } from "~/services.server/api"

import type { SerializeFrom } from "@remix-run/node"
import { differenceInDays } from "date-fns"
import { BellPlusIcon, SparklesIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { Tooltip, TooltipProvider } from "~/components/ui/tooltip"
import { cx } from "~/utils/cva"

type ToolBadgesProps = HTMLAttributes<HTMLElement> & {
  tool: ToolMany | SerializeFrom<ToolMany>
  size?: "sm" | "md"
}

export const ToolBadges = ({ tool, size, children, className, ...props }: ToolBadgesProps) => {
  const today = new Date()
  const isNew = !!tool.firstCommitDate && differenceInDays(today, tool.firstCommitDate) <= 365
  const isFresh = !!tool.publishedAt && differenceInDays(today, tool.publishedAt) <= 30

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
