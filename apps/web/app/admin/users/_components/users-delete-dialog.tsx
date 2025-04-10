"use client"

import type { User } from "@openalternative/db/client"
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
import { deleteUsers } from "~/server/admin/users/actions"

type UsersDeleteDialogProps = ComponentProps<typeof Dialog> & {
  users: User[]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const UsersDeleteDialog = ({
  users,
  showTrigger = true,
  onSuccess,
  ...props
}: UsersDeleteDialogProps) => {
  const { execute, isPending } = useServerAction(deleteUsers, {
    onSuccess: () => {
      props.onOpenChange?.(false)
      toast.success("Users deleted")
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
            Delete ({users.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{users.length}</span>
            {users.length === 1 ? " user" : " users"} from our servers.
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
            onClick={() => execute({ ids: users.map(({ id }) => id) })}
            isPending={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
