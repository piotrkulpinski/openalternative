"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { redirect } from "next/navigation"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
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
import { getSlug, nullsToUndefined } from "~/utils/helpers"

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
  const [isSubmitPending, startSubmitTransition] = React.useTransition()

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: nullsToUndefined(category),
  })

  const [selectedTools, setSelectedTools] = React.useState<string[]>(
    category?.tools?.map(({ tool }) => tool.id) || [],
  )

  function onSubmit(input: CategorySchema) {
    startSubmitTransition(async () => {
      const payload = {
        ...input,
        slug: input.slug || getSlug(input.name),

        tools: {
          // Delete existing relations
          deleteMany: category ? { categoryId: category.id } : undefined,

          // Create new relations
          create: selectedTools.map(id => ({
            tool: {
              connect: { id },
            },
          })),
        },
      }

      const { error, data } = category
        ? await updateCategory(category.id, payload)
        : await createCategory(payload)

      if (error) {
        toast.error(error)
        return
      }

      toast.success(`Category successfully ${category ? "updated" : "created"}`)

      if (!category && data) {
        redirect(`/categories/${data.id}`)
      }
    })
  }

  React.useEffect(() => {
    form.reset(nullsToUndefined(category))
  }, [category, form])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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

        <FormItem className="col-span-full">
          <FormLabel>Tools</FormLabel>

          <RelationSelector
            relations={tools}
            selectedIds={selectedTools}
            onChange={setSelectedTools}
          />
        </FormItem>

        <div className="flex justify-end gap-2 col-span-full">
          <Button variant="outline" asChild>
            <Link href="/categories">Cancel</Link>
          </Button>

          <Button isPending={isSubmitPending} disabled={isSubmitPending}>
            {category ? "Update category" : "Create category"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
