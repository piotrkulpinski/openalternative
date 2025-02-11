"use client"

import type { Tool } from "@openalternative/db/client"
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
import { deleteTools } from "~/server/admin/tools/actions"

interface ToolsDeleteDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tools: Tool[]
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
      props.onOpenChange?.(false)
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
          <Button variant="secondary" size="md" prefix={<TrashIcon />}>
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
            <Button variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button
            aria-label="Delete selected rows"
            size="md"
            variant="destructive"
            className="min-w-28"
            onClick={() => execute({ ids: tools.map(({ id }) => id) })}
            isPending={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
