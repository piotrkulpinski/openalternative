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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { createCategory, updateCategory } from "~/server/admin/categories/actions"
import type { findCategoryBySlug } from "~/server/admin/categories/queries"
import { type CategorySchema, categorySchema } from "~/server/admin/categories/validations"
import type { findToolList } from "~/server/admin/tools/queries"
import { cx } from "~/utils/cva"
import { nullsToUndefined } from "~/utils/helpers"

type CategoryFormProps = React.HTMLAttributes<HTMLFormElement> & {
  category?: Awaited<ReturnType<typeof findCategoryBySlug>>
  tools: ReturnType<typeof findToolList>
}

export function CategoryForm({
  children,
  className,
  category,
  tools,
  ...props
}: CategoryFormProps) {
  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      ...nullsToUndefined(category),
      tools: category?.tools.map(({ id }) => id),
    },
  })

  // Create category
  const { execute: createCategoryAction, isPending: isCreatingCategory } = useServerAction(
    createCategory,
    {
      onSuccess: ({ data }) => {
        toast.success("Category successfully created")
        redirect(`/admin/categories/${data.slug}`)
      },

      onError: ({ err }) => {
        toast.error(err.message)
      },
    },
  )

  // Update category
  const { execute: updateCategoryAction, isPending: isUpdatingCategory } = useServerAction(
    updateCategory,
    {
      onSuccess: ({ data }) => {
        toast.success("Category successfully updated")
        redirect(`/admin/categories/${data.slug}`)
      },

      onError: ({ err }) => {
        toast.error(err.message)
      },
    },
  )

  const onSubmit = form.handleSubmit(data => {
    category ? updateCategoryAction({ id: category.id, ...data }) : createCategoryAction(data)
  })

  const isPending = isCreatingCategory || isUpdatingCategory

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
                  <Input {...field} />
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
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
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
            <Link href="/admin/categories">Cancel</Link>
          </Button>

          <Button isPending={isPending} disabled={isPending}>
            {category ? "Update category" : "Create category"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
