"use client"

import type { Tool } from "@openalternative/db"
import type { Row } from "@tanstack/react-table"
import { ClockIcon } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { publishTool } from "../_lib/actions"
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

interface PublishToolDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tool: Row<Tool>["original"]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const PublishToolDialog = ({
  tool,
  showTrigger = true,
  onSuccess,
  ...props
}: PublishToolDialogProps) => {
  const [isPublishPending, startPublishTransition] = React.useTransition()
  const [publishDate, setPublishDate] = React.useState<Date | undefined>(undefined)

  const onPublish = () => {
    startPublishTransition(async () => {
      if (!publishDate) {
        toast.error("Please select a date to publish")
        return
      }

      const { error } = await publishTool(tool.id, publishDate)

      if (error) {
        toast.error(error)
        return
      }

      props.onOpenChange?.(false)
      toast.success("Tool published")
      onSuccess?.()
    })
  }

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
          selected={publishDate}
          onSelect={setPublishDate}
          className="px-0"
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            aria-label="Publish"
            variant="default"
            onClick={onPublish}
            isPending={isPublishPending}
            disabled={!publishDate || isPublishPending}
          >
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
