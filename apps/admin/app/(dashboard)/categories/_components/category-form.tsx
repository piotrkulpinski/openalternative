"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { redirect } from "next/navigation"
import type React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { createCategory, updateCategory } from "~/app/(dashboard)/categories/_lib/actions"
import type { getCategoryById, getTools } from "~/app/(dashboard)/categories/_lib/queries"
import { type CategorySchema, categorySchema } from "~/app/(dashboard)/categories/_lib/validations"
import { RelationSelector } from "~/components/relation-selector"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { cx } from "~/utils/cva"
import { nullsToUndefined } from "~/utils/helpers"

type CategoryFormProps = React.HTMLAttributes<HTMLFormElement> & {
  category?: Awaited<ReturnType<typeof getCategoryById>>
  tools: Awaited<ReturnType<typeof getTools>>
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
      tools: category?.tools.map(({ tool }) => tool.id),
    },
  })

  // Create category
  const { execute: createCategoryAction, isPending: isCreatingCategory } = useServerAction(
    createCategory,
    {
      onSuccess: ({ data }) => {
        toast.success("Category successfully created")
        redirect(`/categories/${data.id}`)
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
        redirect(`/categories/${data.id}`)
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
                relations={tools}
                selectedIds={field.value ?? []}
                onChange={field.onChange}
              />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button variant="outline" asChild>
            <Link href="/categories">Cancel</Link>
          </Button>

          <Button isPending={isPending} disabled={isPending}>
            {category ? "Update category" : "Create category"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
