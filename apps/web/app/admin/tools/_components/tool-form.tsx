"use client"

import { slugify } from "@curiousleaf/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { ToolStatus } from "@openalternative/db/client"
import { formatDate } from "date-fns"
import { redirect } from "next/navigation"
import type { ComponentProps } from "react"
import { useState } from "react"
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
import { Input, inputVariants } from "~/components/common/input"
import { Link } from "~/components/common/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { Stack } from "~/components/common/stack"
import { Switch } from "~/components/common/switch"
import { TextArea } from "~/components/common/textarea"
import { Markdown } from "~/components/web/markdown"
import { useComputedField } from "~/hooks/use-computed-field"
import type { findAlternativeList } from "~/server/admin/alternatives/queries"
import type { findCategoryList } from "~/server/admin/categories/queries"
import { createTool, updateTool } from "~/server/admin/tools/actions"
import type { findToolBySlug } from "~/server/admin/tools/queries"
import { toolSchema } from "~/server/admin/tools/schemas"
import { cx } from "~/utils/cva"

type ToolFormProps = ComponentProps<"form"> & {
  tool?: Awaited<ReturnType<typeof findToolBySlug>>
  alternatives: ReturnType<typeof findAlternativeList>
  categories: ReturnType<typeof findCategoryList>
}

export function ToolForm({
  children,
  className,
  tool,
  alternatives,
  categories,
  ...props
}: ToolFormProps) {
  const [isPreviewing, setIsPreviewing] = useState(false)

  const form = useForm({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: tool?.name ?? "",
      slug: tool?.slug ?? "",
      tagline: tool?.tagline ?? "",
      description: tool?.description ?? "",
      content: tool?.content ?? "",
      websiteUrl: tool?.websiteUrl ?? "",
      affiliateUrl: tool?.affiliateUrl ?? "",
      repositoryUrl: tool?.repositoryUrl ?? "",
      faviconUrl: tool?.faviconUrl ?? "",
      screenshotUrl: tool?.screenshotUrl ?? "",
      isFeatured: tool?.isFeatured ?? false,
      isSelfHosted: tool?.isSelfHosted ?? false,
      submitterName: tool?.submitterName ?? "",
      submitterEmail: tool?.submitterEmail ?? "",
      submitterNote: tool?.submitterNote ?? "",
      hostingUrl: tool?.hostingUrl ?? "",
      discountCode: tool?.discountCode ?? "",
      discountAmount: tool?.discountAmount ?? "",
      status: tool?.status ?? ToolStatus.Draft,
      publishedAt: tool?.publishedAt ?? undefined,
      alternatives: tool?.alternatives.map(a => a.id) ?? [],
      categories: tool?.categories.map(c => c.id) ?? [],
    },
  })

  // Set the slug based on the name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !tool,
  })

  const [websiteUrl, name, description, content] = form.watch([
    "websiteUrl",
    "name",
    "description",
    "content",
  ])

  // Create tool
  const { execute: createToolAction, isPending: isCreatingTool } = useServerAction(createTool, {
    onSuccess: ({ data }) => {
      toast.success("Tool successfully created")
      redirect(`/admin/tools/${data.slug}`)
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  // Update tool
  const { execute: updateToolAction, isPending: isUpdatingTool } = useServerAction(updateTool, {
    onSuccess: ({ data }) => {
      toast.success("Tool successfully updated")

      if (data.slug !== tool?.slug) {
        redirect(`/admin/tools/${data.slug}`)
      }
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  const onSubmit = form.handleSubmit(data => {
    tool ? updateToolAction({ id: tool.id, ...data }) : createToolAction(data)
  })

  const isPending = isCreatingTool || isUpdatingTool

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cx("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
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
            <FormItem className="flex-1">
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="affiliateUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Affiliate URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repositoryUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository URL</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
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
          name="content"
          render={({ field }) => (
            <FormItem className="col-span-full items-stretch">
              <Stack className="justify-between">
                <FormLabel>Content</FormLabel>

                {field.value && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsPreviewing(prev => !prev)}
                    prefix={
                      isPreviewing ? <Icon name="lucide/pencil" /> : <Icon name="lucide/eye" />
                    }
                    className="-my-1"
                  >
                    {isPreviewing ? "Edit" : "Preview"}
                  </Button>
                )}
              </Stack>

              <FormControl>
                {field.value && isPreviewing ? (
                  <Markdown
                    code={field.value}
                    className={cx(inputVariants(), "max-w-none border leading-normal")}
                  />
                ) : (
                  <TextArea {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row gap-4 max-sm:contents">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex-1">
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
            name="isSelfHosted"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Self-hosted</FormLabel>
                <FormControl>
                  <Switch onCheckedChange={field.onChange} checked={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-row gap-4 max-sm:contents">
          <FormField
            control={form.control}
            name="publishedAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Published At</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={field.value ? formatDate(field.value, "yyyy-MM-dd HH:mm") : undefined}
                    onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {Object.values(ToolStatus).map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="submitterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Submitter Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="submitterEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Submitter Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="submitterNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Submitter Note</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hostingUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hosting URL</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
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
          name="screenshotUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screenshot URL</FormLabel>
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
          name="alternatives"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternatives</FormLabel>
              <RelationSelector
                promise={alternatives}
                selectedIds={field.value ?? []}
                onChange={field.onChange}
                maxSuggestions={10}
                prompt={
                  name &&
                  description &&
                  content &&
                  `From the list of available alternative, proprietary software below, suggest relevant alternatives for this open source tool link: 
                  
                  - URL: ${websiteUrl}
                  - Meta title: ${name}
                  - Meta description: ${description}
                  - Content: ${content}. 
                  `
                }
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <RelationSelector
                promise={categories}
                selectedIds={field.value ?? []}
                onChange={field.onChange}
                prompt={
                  name &&
                  description &&
                  `From the list of available categories below, suggest relevant categories for this link: 
                  
                  - URL: ${websiteUrl}
                  - Meta title: ${name}
                  - Meta description: ${description}.
                  `
                }
              />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/tools">Cancel</Link>
          </Button>

          <Button size="md" variant="primary" isPending={isPending}>
            {tool ? "Update tool" : "Create tool"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
