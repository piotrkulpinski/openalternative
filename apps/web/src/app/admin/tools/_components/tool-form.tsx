"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ToolStatus } from "@openalternative/db/client"
import { formatDate } from "date-fns"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/admin/ui/select"
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
import type { findAlternativeList } from "~/server/admin/alternatives/queries"
import type { findCategoryList } from "~/server/admin/categories/queries"
import { createTool, updateTool } from "~/server/admin/tools/actions"
import type { findToolBySlug } from "~/server/admin/tools/queries"
import { type ToolSchema, toolSchema } from "~/server/admin/tools/validations"
import { cx } from "~/utils/cva"
import { nullsToUndefined } from "~/utils/helpers"

type ToolFormProps = React.HTMLAttributes<HTMLFormElement> & {
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
  const form = useForm<ToolSchema>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      ...nullsToUndefined(tool),
      alternatives: tool?.alternatives.map(({ id }) => id),
      categories: tool?.categories.map(({ id }) => id),
    },
  })

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
      redirect(`/admin/tools/${data.slug}`)
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
        <div className="flex flex-row gap-4 max-sm:contents">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
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
              <FormItem className="flex-1">
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
          name="content"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
                    <SelectTrigger className="w-full tabular-nums">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent side="top" className="tabular-nums">
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
              />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button variant="outline" asChild>
            <Link href="/admin/tools">Cancel</Link>
          </Button>

          <Button isPending={isPending} disabled={isPending}>
            {tool ? "Update tool" : "Create tool"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
