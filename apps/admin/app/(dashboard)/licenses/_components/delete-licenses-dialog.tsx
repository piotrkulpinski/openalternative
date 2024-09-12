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
import { useMediaQuery } from "~/hooks/use-media-query"
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
  const isDesktop = useMediaQuery("(min-width: 640px)")

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

  const DeleteDialog = Object.assign(isDesktop ? Dialog : Drawer, {
    Trigger: isDesktop ? DialogTrigger : DrawerTrigger,
    Content: isDesktop ? DialogContent : DrawerContent,
    Header: isDesktop ? DialogHeader : DrawerHeader,
    Title: isDesktop ? DialogTitle : DrawerTitle,
    Description: isDesktop ? DialogDescription : DrawerDescription,
    Footer: isDesktop ? DialogFooter : DrawerFooter,
    Close: isDesktop ? DialogClose : DrawerClose,
  })

  return (
    <DeleteDialog {...props}>
      {showTrigger && (
        <DeleteDialog.Trigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className={isDesktop ? undefined : "mr-2"} aria-hidden="true" />
            Delete ({licenses.length})
          </Button>
        </DeleteDialog.Trigger>
      )}

      <DeleteDialog.Content>
        <DeleteDialog.Header>
          <DeleteDialog.Title>Are you absolutely sure?</DeleteDialog.Title>
          <DeleteDialog.Description>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{licenses.length}</span>
            {licenses.length === 1 ? " license" : " licenses"} from our servers.
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
