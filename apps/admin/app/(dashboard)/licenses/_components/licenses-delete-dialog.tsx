"use client"

import type { License } from "@openalternative/db"
import type { Row } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import type * as React from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
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

interface LicensesDeleteDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  licenses: Row<License>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const LicensesDeleteDialog = ({
  licenses,
  showTrigger = true,
  onSuccess,
  ...props
}: LicensesDeleteDialogProps) => {
  const { execute, isPending } = useServerAction(deleteLicenses, {
    onSuccess: () => {
      toast.success("Licenses deleted")
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
          <Button variant="outline" size="sm" prefix={<TrashIcon />}>
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
            onClick={() => execute({ ids: licenses.map(({ id }) => id) })}
            isPending={isPending}
            disabled={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
