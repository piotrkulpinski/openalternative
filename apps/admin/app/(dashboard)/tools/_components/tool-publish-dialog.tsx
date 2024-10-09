"use client"

import type { Tool } from "@openalternative/db"
import type { Row } from "@tanstack/react-table"
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
import { publishTool } from "../_lib/actions"

interface ToolPublishDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tool: Row<Tool>["original"]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const ToolPublishDialog = ({
  tool,
  showTrigger = true,
  onSuccess,
  ...props
}: ToolPublishDialogProps) => {
  const [publishedAt, setPublishedAt] = React.useState<Date | undefined>(undefined)

  const { execute, isPending } = useServerAction(publishTool, {
    onSuccess: () => {
      props.onOpenChange?.(false)
      toast.success("Tool published")
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
            Publish
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
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
