"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "~/components/ui/Button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/Sheet"

import type { Tool } from "@openalternative/db"
import { Input } from "~/components/ui/Input"
import { updateTool } from "../lib/actions"
import { type UpdateToolSchema, updateToolSchema } from "../lib/validations"

interface UpdateToolSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  tool: Tool
}

export function UpdateToolSheet({ tool, ...props }: UpdateToolSheetProps) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition()

  const form = useForm<UpdateToolSchema>({
    resolver: zodResolver(updateToolSchema),
    defaultValues: {
      name: tool.name,
    },
  })

  React.useEffect(() => {
    form.reset({
      name: tool.name,
    })
  }, [tool, form])

  function onSubmit(input: UpdateToolSchema) {
    startUpdateTransition(async () => {
      const { error } = await updateTool(tool.id, input)

      if (error) {
        toast.error(error)
        return
      }

      form.reset()
      props.onOpenChange?.(false)
      toast.success("Tool updated")
    })
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update tool</SheetTitle>
          <SheetDescription>Update the tool details and save the changes</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="PostHog" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a label" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {tools.label.enumValues.map(item => (
                          <SelectItem key={item} value={item} className="capitalize">
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {tools.status.enumValues.map(item => (
                          <SelectItem key={item} value={item} className="capitalize">
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {tools.priority.enumValues.map(item => (
                          <SelectItem key={item} value={item} className="capitalize">
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>

              <Button isPending={isUpdatePending} disabled={isUpdatePending}>
                Save
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}