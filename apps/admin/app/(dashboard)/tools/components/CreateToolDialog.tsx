"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "~/components/ui/Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/Drawer"
import { useMediaQuery } from "~/hooks/use-media-query"
import { createTool } from "../lib/actions"
import { type CreateToolSchema, createToolSchema } from "../lib/validations"
import { CreateToolForm } from "./CreateToolForm"

export function CreateToolDialog({ ...props }: React.ComponentPropsWithoutRef<typeof Button>) {
  const [open, setOpen] = React.useState(false)
  const [isCreatePending, startCreateTransition] = React.useTransition()
  const isDesktop = useMediaQuery("(min-width: 640px)")

  const form = useForm<CreateToolSchema>({
    resolver: zodResolver(createToolSchema),
  })

  function onSubmit(input: CreateToolSchema) {
    startCreateTransition(async () => {
      const { error } = await createTool(input)

      if (error) {
        toast.error(error)
        return
      }

      form.reset()
      setOpen(false)
      toast.success("Tool created")
    })
  }

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" prefix={<PlusIcon />} {...props}>
            New tool
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create tool</DialogTitle>
            <DialogDescription>Fill in the details below to create a new tool.</DialogDescription>
          </DialogHeader>

          <CreateToolForm form={form} onSubmit={onSubmit}>
            <DialogFooter className="gap-2 pt-2 sm:space-x-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button isPending={isCreatePending} disabled={isCreatePending}>
                Create
              </Button>
            </DialogFooter>
          </CreateToolForm>
        </DialogContent>
      </Dialog>
    )

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" prefix={<PlusIcon />} {...props}>
          New tool
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create tool</DrawerTitle>
          <DrawerDescription>Fill in the details below to create a new tool.</DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>

          <Button isPending={isCreatePending} disabled={isCreatePending}>
            Create
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
