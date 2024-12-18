"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { redirect } from "next/navigation"
import type React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { RelationSelector } from "~/components/admin/relation-selector"
import { Button } from "~/components/admin/ui/button"
import { Input } from "~/components/admin/ui/input"
import { Switch } from "~/components/admin/ui/switch"
import { Textarea } from "~/components/admin/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { createAlternative, updateAlternative } from "~/server/admin/alternatives/actions"
import type { findAlternativeBySlug } from "~/server/admin/alternatives/queries"
import { type AlternativeSchema, alternativeSchema } from "~/server/admin/alternatives/validations"
import type { findToolList } from "~/server/admin/tools/queries"
import { cx } from "~/utils/cva"
import { nullsToUndefined } from "~/utils/helpers"

type AlternativeFormProps = React.HTMLAttributes<HTMLFormElement> & {
  alternative?: Awaited<ReturnType<typeof findAlternativeBySlug>>
  tools: ReturnType<typeof findToolList>
}

export function AlternativeForm({
  children,
  className,
  alternative,
  tools,
  ...props
}: AlternativeFormProps) {
  const form = useForm<AlternativeSchema>({
    resolver: zodResolver(alternativeSchema),
    defaultValues: {
      ...nullsToUndefined(alternative),
      tools: alternative?.tools.map(({ id }) => id),
    },
  })

  // Create alternative
  const { execute: createAlternativeAction, isPending: isCreatingAlternative } = useServerAction(
    createAlternative,
    {
      onSuccess: ({ data }) => {
        toast.success("Alternative successfully created")
        redirect(`/admin/alternatives/${data.slug}`)
      },

      onError: ({ err }) => {
        toast.error(err.message)
      },
    },
  )

  // Update alternative
  const { execute: updateAlternativeAction, isPending: isUpdatingAlternative } = useServerAction(
    updateAlternative,
    {
      onSuccess: ({ data }) => {
        toast.success("Alternative successfully updated")
        redirect(`/admin/alternatives/${data.slug}`)
      },

      onError: ({ err }) => {
        toast.error(err.message)
      },
    },
  )

  const onSubmit = form.handleSubmit(data => {
    alternative
      ? updateAlternativeAction({ id: alternative.id, ...data })
      : createAlternativeAction(data)
  })

  const isPending = isCreatingAlternative || isUpdatingAlternative

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cx("grid grid-cols-1 gap-4 max-w-3xl sm:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <div className="flex flex-col gap-4 sm:flex-row">
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
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="posthog" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://posthog.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-full">
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
          name="isFeatured"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured</FormLabel>
              <FormControl>
                <Switch onCheckedChange={field.onChange} checked={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="faviconUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favicon URL</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discountCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discountAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Amount</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tools"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Tools</FormLabel>
              <RelationSelector
                promise={tools}
                selectedIds={field.value ?? []}
                onChange={field.onChange}
              />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button variant="outline" asChild>
            <Link href="/admin/alternatives">Cancel</Link>
          </Button>

          <Button isPending={isPending} disabled={isPending}>
            {alternative ? "Update alternative" : "Create alternative"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
