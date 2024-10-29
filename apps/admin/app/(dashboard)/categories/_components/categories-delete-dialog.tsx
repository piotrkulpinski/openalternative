"use client"

import type { Category } from "@openalternative/db"
import type { Row } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
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
import { deleteCategories } from "../_lib/actions"

interface CategoriesDeleteDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  categories: Row<Category>["original"][]
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
          <Button variant="outline" size="sm" prefix={<TrashIcon />}>
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
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={() => execute({ ids: categories.map(({ id }) => id) })}
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
