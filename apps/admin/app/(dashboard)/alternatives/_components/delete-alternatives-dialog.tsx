"use client"

import type { Alternative } from "@openalternative/db"
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
import { deleteAlternatives } from "../_lib/actions"

interface DeleteAlternativesDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  alternatives: Row<Alternative>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const DeleteAlternativesDialog = ({
  alternatives,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteAlternativesDialogProps) => {
  const [isDeletePending, startDeleteTransition] = React.useTransition()

  const onDelete = () => {
    startDeleteTransition(async () => {
      const { error } = await deleteAlternatives({
        ids: alternatives.map(({ id }) => id),
      })

      if (error) {
        toast.error(error)
        return
      }

      props.onOpenChange?.(false)
      toast.success("Alternatives deleted")
      onSuccess?.()
    })
  }

  return (
    <Dialog {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" prefix={<TrashIcon />}>
            Delete ({alternatives.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{alternatives.length}</span>
            {alternatives.length === 1 ? " alternative" : " alternatives"} from our servers.
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
