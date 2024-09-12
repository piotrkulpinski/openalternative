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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"
import { useIsMobile } from "~/hooks/use-mobile"
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
  const isMobile = useIsMobile()

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

  const DeleteDialog = Object.assign(isMobile ? Drawer : Dialog, {
    Trigger: isMobile ? DrawerTrigger : DialogTrigger,
    Content: isMobile ? DrawerContent : DialogContent,
    Header: isMobile ? DrawerHeader : DialogHeader,
    Title: isMobile ? DrawerTitle : DialogTitle,
    Description: isMobile ? DrawerDescription : DialogDescription,
    Footer: isMobile ? DrawerFooter : DialogFooter,
    Close: isMobile ? DrawerClose : DialogClose,
  })

  return (
    <DeleteDialog {...props}>
      {showTrigger && (
        <DeleteDialog.Trigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className={isMobile ? "mr-2" : undefined} aria-hidden="true" />
            Delete ({alternatives.length})
          </Button>
        </DeleteDialog.Trigger>
      )}

      <DeleteDialog.Content>
        <DeleteDialog.Header>
          <DeleteDialog.Title>Are you absolutely sure?</DeleteDialog.Title>
          <DeleteDialog.Description>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{alternatives.length}</span>
            {alternatives.length === 1 ? " alternative" : " alternatives"} from our servers.
          </DeleteDialog.Description>
        </DeleteDialog.Header>

        <DeleteDialog.Footer className="gap-2 sm:space-x-0">
          <DeleteDialog.Close asChild>
            <Button variant="outline">Cancel</Button>
          </DeleteDialog.Close>

          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            isPending={isDeletePending}
            disabled={isDeletePending}
          >
            Delete
          </Button>
        </DeleteDialog.Footer>
      </DeleteDialog.Content>
    </DeleteDialog>
  )
}
