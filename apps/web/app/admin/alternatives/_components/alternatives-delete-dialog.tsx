"use client"

import type { Alternative } from "@openalternative/db/client"
import type { ComponentProps } from "react"
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
import { Icon } from "~/components/common/icon"
import { deleteAlternatives } from "~/server/admin/alternatives/actions"

type AlternativesDeleteDialogProps = ComponentProps<typeof Dialog> & {
  alternatives: Alternative[]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const AlternativesDeleteDialog = ({
  alternatives,
  showTrigger = true,
  onSuccess,
  ...props
}: AlternativesDeleteDialogProps) => {
  const { execute, isPending } = useServerAction(deleteAlternatives, {
    onSuccess: () => {
      props.onOpenChange?.(false)
      toast.success("Alternatives deleted")
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
          <Button variant="secondary" size="md" prefix={<Icon name="lucide/trash" />}>
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
            <Button variant="secondary">Cancel</Button>
          </DialogClose>

          <Button
            aria-label="Delete selected rows"
            size="md"
            variant="destructive"
            className="min-w-28"
            onClick={() => execute({ ids: alternatives.map(({ id }) => id) })}
            isPending={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
