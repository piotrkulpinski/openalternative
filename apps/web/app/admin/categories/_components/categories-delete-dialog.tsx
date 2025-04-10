"use client"

import type { Category } from "@openalternative/db/client"
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
import { deleteCategories } from "~/server/admin/categories/actions"

type CategoriesDeleteDialogProps = ComponentProps<typeof Dialog> & {
  categories: Category[]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const CategoriesDeleteDialog = ({
  categories,
  showTrigger = true,
  onSuccess,
  ...props
}: CategoriesDeleteDialogProps) => {
  const { execute, isPending } = useServerAction(deleteCategories, {
    onSuccess: () => {
      props.onOpenChange?.(false)
      toast.success("Categories deleted")
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
            Delete ({categories.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{categories.length}</span>
            {categories.length === 1 ? " category" : " categories"} from our servers.
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
            onClick={() => execute({ ids: categories.map(({ id }) => id) })}
            isPending={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
