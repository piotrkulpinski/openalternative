"use client"

import { isTruthy } from "@curiousleaf/utils"
import type { Tool } from "@openalternative/db"
import type { Row } from "@tanstack/react-table"
import { isFriday } from "date-fns"
import { addDays, isWednesday } from "date-fns"
import { isMonday } from "date-fns"
import { ClockIcon } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { scheduleTool } from "../_lib/actions"

interface ToolScheduleDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tool: Row<Tool>["original"]
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
          <Button variant="outline" size="sm">
            <ClockIcon className="max-sm:mr-2" aria-hidden="true" />
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
          initialFocus
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
            schedulable: "bg-yellow-500/15",
          }}
          showOutsideDays={false}
          className="px-0"
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            aria-label="Publish"
            variant="default"
            onClick={() => publishedAt && execute({ id: tool.id, publishedAt })}
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
