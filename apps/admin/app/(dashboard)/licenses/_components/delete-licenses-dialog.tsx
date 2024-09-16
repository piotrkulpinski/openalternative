"use client"

import type { License } from "@openalternative/db"
import type { Row } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
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
import { deleteLicenses } from "../_lib/actions"

interface DeleteLicensesDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  licenses: Row<License>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const DeleteLicensesDialog = ({
  licenses,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteLicensesDialogProps) => {
  const [isDeletePending, startDeleteTransition] = React.useTransition()

  const onDelete = () => {
    startDeleteTransition(async () => {
      const { error } = await deleteLicenses({
        ids: licenses.map(({ id }) => id),
      })

      if (error) {
        toast.error(error)
        return
      }

      props.onOpenChange?.(false)
      toast.success("Licenses deleted")
      onSuccess?.()
    })
  }

  return (
    <Dialog {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="max-sm:mr-2" aria-hidden="true" />
            Delete ({licenses.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{licenses.length}</span>
            {licenses.length === 1 ? " license" : " licenses"} from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            isPending={isDeletePending}
            disabled={isDeletePending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
