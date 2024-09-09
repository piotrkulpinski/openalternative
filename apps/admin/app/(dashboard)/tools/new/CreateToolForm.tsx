"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { redirect } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createTool } from "~/app/(dashboard)/tools/lib/actions"
import { type CreateToolSchema, createToolSchema } from "~/app/(dashboard)/tools/lib/validations"
import { Button } from "~/components/ui/Button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form"
import { Input } from "~/components/ui/Input"
import { Textarea } from "~/components/ui/Textarea"

export function CreateToolForm() {
  const [isCreatePending, startCreateTransition] = React.useTransition()

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
      toast.success("Tool successfully created")

      // Redirect to the tools page
      redirect("/tools")
    })
  }

  console.log(form.formState.errors)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 max-w-3xl"
        noValidate
      >
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

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://posthog.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repository"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://github.com/posthog/posthog" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagline</FormLabel>
              <FormControl>
                <Input placeholder="How developers build successful products" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="PostHog is the only all-in-one platform for product analytics, feature flags, session replays, experiments, and surveys that's built for developers."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
        <div className="flex justify-end gap-2 col-span-2">
          <Button variant="outline" asChild>
            <Link href="/tools">Cancel</Link>
          </Button>

          <Button isPending={isCreatePending} disabled={isCreatePending}>
            Create tool
          </Button>
        </div>
      </form>
    </Form>
  )
}
