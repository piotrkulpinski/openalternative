"use client"

import { slugify } from "@curiousleaf/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { redirect } from "next/navigation"
import { type ComponentProps, use, useMemo } from "react"
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
import { Icon } from "~/components/common/icon"
import { Input } from "~/components/common/input"
import { Link } from "~/components/common/link"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { Stack } from "~/components/common/stack"
import { useComputedField } from "~/hooks/use-computed-field"
import { createCategory, updateCategory } from "~/server/admin/categories/actions"
import type { findCategoryBySlug, findCategoryList } from "~/server/admin/categories/queries"
import { categorySchema } from "~/server/admin/categories/schemas"
import type { findToolList } from "~/server/admin/tools/queries"
import { cx } from "~/utils/cva"

type CategoryFormProps = ComponentProps<"form"> & {
  category?: Awaited<ReturnType<typeof findCategoryBySlug>>
  tools: ReturnType<typeof findToolList>
  categories: ReturnType<typeof findCategoryList>
}

export function CategoryForm({
  children,
  className,
  category,
  tools,
  categories,
  ...props
}: CategoryFormProps) {
  const parents = use(categories)

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      label: category?.label ?? "",
      description: category?.description ?? "",
      parentId: category?.parentId ?? undefined,
      tools: category?.tools.map(t => t.id) ?? [],
    },
  })

  // Set the slug based on the name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !category,
  })

  // Set the label based on the name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "label",
    callback: name => name && `${name} Tools`,
    enabled: !category,
  })

  // Group available categories by parent
  const groupedCategories = useMemo(() => {
    return parents.reduce(
      (acc, category) => {
        // Skip categories with no parent or with path that's too deep
        if (!category.parentId || category.fullPath.split("/").length >= 3) {
          return acc
        }

        if (!acc[category.parentId]) {
          acc[category.parentId] = []
        }

        acc[category.parentId].push(category)
        return acc
      },
      {} as Record<string, typeof parents>,
    )
  }, [parents])

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

        if (data.slug !== category?.slug) {
          redirect(`/admin/categories/${data.slug}`)
        }
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem className="items-stretch">
              <Stack className="justify-between">
                <FormLabel>Parent Category</FormLabel>

                {field.value && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => form.setValue("parentId", "")}
                    prefix={<Icon name="lucide/x" />}
                    className="-my-1"
                  >
                    Clear
                  </Button>
                )}
              </Stack>

              <FormControl>
                <Select
                  disabled={!!category?.subcategories.length}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None (Top Level)" />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.entries(groupedCategories).map(([parentId, categories]) => (
                      <SelectGroup key={parentId} className="not-first:mt-2">
                        <SelectItem value={parentId} className="font-semibold text-foreground">
                          {parents.find(c => c.id === parentId)?.name}
                        </SelectItem>

                        {categories.map(parent => (
                          <SelectItem key={parent.id} value={parent.id}>
                            – {parent.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
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
            <Link href="/admin/categories">Cancel</Link>
          </Button>

          <Button size="md" variant="primary" isPending={isPending}>
            {category ? "Update category" : "Create category"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
