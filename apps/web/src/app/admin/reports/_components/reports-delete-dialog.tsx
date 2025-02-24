"use client"

import type { Report } from "@openalternative/db/client"
import { TrashIcon } from "lucide-react"
import type * as React from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/common/button"
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
import { deleteReports } from "~/server/admin/reports/actions"

interface ReportsDeleteDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  reports: Report[]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const ReportsDeleteDialog = ({
  reports,
  showTrigger = true,
  onSuccess,
  ...props
}: ReportsDeleteDialogProps) => {
  const { execute, isPending } = useServerAction(deleteReports, {
    onSuccess: () => {
      props.onOpenChange?.(false)
      toast.success("Reports deleted")
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
          <Button variant="secondary" size="md" prefix={<TrashIcon />}>
            Delete ({reports.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{reports.length}</span>
            {reports.length === 1 ? " report" : " reports"} from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>

          <Button
            aria-label="Delete selected rows"
            size="md"
            variant="destructive"
            className="min-w-28"
            onClick={() => execute({ ids: reports.map(({ id }) => id) })}
            isPending={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
