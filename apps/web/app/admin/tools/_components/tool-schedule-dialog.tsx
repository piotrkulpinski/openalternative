"use client"

import { isTruthy } from "@curiousleaf/utils"
import type { Tool } from "@openalternative/db/client"
import { isFriday } from "date-fns"
import { addDays, isWednesday } from "date-fns"
import { isMonday } from "date-fns"
import * as React from "react"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/common/button"
import { Calendar } from "~/components/common/calendar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/common/dialog"
import { Icon } from "~/components/common/icon"
import { scheduleTool } from "~/server/admin/tools/actions"

type ToolScheduleDialogProps = ComponentProps<typeof Dialog> & {
  tool?: Tool
  showTrigger?: boolean
  onSuccess?: () => void
}

export const ToolScheduleDialog = ({
  tool,
  showTrigger = true,
  onSuccess,
  ...props
}: ToolScheduleDialogProps) => {
  const [publishedAt, setPublishedAt] = React.useState<Date | undefined>(undefined)

  const { execute, isPending } = useServerAction(scheduleTool, {
    onSuccess: () => {
      props.onOpenChange?.(false)
      toast.success("Tool scheduled")
      onSuccess?.()
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  return (
    <Dialog {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="secondary" size="md">
            <Icon name="lucide/clock" className="max-sm:mr-2" aria-hidden="true" />
            Schedule
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pick a date to publish</DialogTitle>
          <DialogDescription>This tool will be published on the date you choose.</DialogDescription>
        </DialogHeader>

        <Calendar
          autoFocus
          mode="single"
          selected={publishedAt}
          onSelect={setPublishedAt}
          modifiers={{
            schedulable: Array.from({ length: 365 }, (_, i) => {
              const date = addDays(new Date(), i)
              return isMonday(date) || isWednesday(date) || isFriday(date) ? date : undefined
            }).filter(isTruthy),
          }}
          modifiersClassNames={{
            schedulable:
              "before:absolute before:bottom-0.5 before:left-1/2 before:z-10 before:size-1 before:rounded-full before:bg-chart-1 before:-translate-x-1/2",
          }}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>

          <Button
            aria-label="Publish selected rows"
            size="md"
            className="min-w-28"
            onClick={() => publishedAt && tool && execute({ id: tool.id, publishedAt })}
            isPending={isPending}
            disabled={!publishedAt || isPending}
          >
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
