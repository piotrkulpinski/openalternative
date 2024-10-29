"use client"

import type { Tool } from "@openalternative/db"
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
import { deleteTools } from "../_lib/actions"

interface ToolsDeleteDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tools: Row<Tool>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const ToolsDeleteDialog = ({
  tools,
  showTrigger = true,
  onSuccess,
  ...props
}: ToolsDeleteDialogProps) => {
  const { execute, isPending } = useServerAction(deleteTools, {
    onSuccess: () => {
      toast.success("Tools deleted")
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
            Delete ({tools.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{tools.length}</span>
            {tools.length === 1 ? " tool" : " tools"} from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={() => execute({ ids: tools.map(({ id }) => id) })}
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
