"use client"

import { slugify } from "@curiousleaf/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { redirect } from "next/navigation"
import type { ComponentProps } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { RelationSelector } from "~/components/admin/relation-selector"
import { Button } from "~/components/common/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { Input } from "~/components/common/input"
import { Link } from "~/components/common/link"
import { Switch } from "~/components/common/switch"
import { TextArea } from "~/components/common/textarea"
import { useComputedField } from "~/hooks/use-computed-field"
import { createAlternative, updateAlternative } from "~/server/admin/alternatives/actions"
import type { findAlternativeBySlug } from "~/server/admin/alternatives/queries"
import { alternativeSchema } from "~/server/admin/alternatives/schemas"
import type { findToolList } from "~/server/admin/tools/queries"
import { cx } from "~/utils/cva"

type AlternativeFormProps = ComponentProps<"form"> & {
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
  const form = useForm({
    resolver: zodResolver(alternativeSchema),
    defaultValues: {
      name: alternative?.name ?? "",
      slug: alternative?.slug ?? "",
      websiteUrl: alternative?.websiteUrl ?? "",
      description: alternative?.description ?? "",
      faviconUrl: alternative?.faviconUrl ?? "",
      isFeatured: alternative?.isFeatured ?? false,
      discountCode: alternative?.discountCode ?? "",
      discountAmount: alternative?.discountAmount ?? "",
      tools: alternative?.tools.map(t => t.id) ?? [],
    },
  })

  // Set the slug based on the name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !alternative,
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

        if (data.slug !== alternative?.slug) {
          redirect(`/admin/alternatives/${data.slug}`)
        }
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
                  <Input data-1p-ignore {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <TextArea {...field} />
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
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/alternatives">Cancel</Link>
          </Button>

          <Button size="md" variant="primary" isPending={isPending}>
            {alternative ? "Update alternative" : "Create alternative"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
