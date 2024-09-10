"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import slugify from "@sindresorhus/slugify"
import { formatDate } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createTool, updateTool } from "~/app/(dashboard)/tools/_lib/actions"
import type {
  getAlternatives,
  getCategories,
  getToolById,
} from "~/app/(dashboard)/tools/_lib/queries"
import { type ToolSchema, toolSchema } from "~/app/(dashboard)/tools/_lib/validations"
import { RelationSelector } from "~/components/RelationSelector"
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
import { Switch } from "~/components/ui/Switch"
import { Textarea } from "~/components/ui/Textarea"
import { cx } from "~/utils/cva"
import { nullsToUndefined } from "~/utils/helpers"

type ToolFormProps = React.HTMLAttributes<HTMLFormElement> & {
  tool?: Awaited<ReturnType<typeof getToolById>>
  alternatives: Awaited<ReturnType<typeof getAlternatives>>
  categories: Awaited<ReturnType<typeof getCategories>>
}

export function ToolForm({
  children,
  className,
  tool,
  alternatives,
  categories,
  ...props
}: ToolFormProps) {
  const router = useRouter()
  const [isSubmitPending, startSubmitTransition] = React.useTransition()

  const form = useForm<ToolSchema>({
    resolver: zodResolver(toolSchema),
    defaultValues: nullsToUndefined(tool),
  })

  const [selectedAlternatives, setSelectedAlternatives] = React.useState<string[]>(
    tool?.alternatives?.map(({ alternative }) => alternative.id) || [],
  )

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    tool?.categories?.map(({ category }) => category.id) || [],
  )

  function onSubmit(input: ToolSchema) {
    startSubmitTransition(async () => {
      const payload = {
        ...input,
        slug: slugify(input.name),

        alternatives: {
          // Delete existing relations
          deleteMany: tool ? { toolId: tool.id } : undefined,

          // Create new relations
          create: selectedAlternatives.map(id => ({
            alternative: {
              connect: { id },
            },
          })),
        },

        categories: {
          // Delete existing relations
          deleteMany: tool ? { toolId: tool.id } : undefined,

          // Create new relations
          create: selectedCategories.map(id => ({
            category: {
              connect: { id },
            },
          })),
        },
      }

      const { error, data } = tool ? await updateTool(tool.id, payload) : await createTool(payload)

      if (error) {
        toast.error(error)
        return
      }

      if (!tool && data) {
        router.push(`/tools/${data.id}`)
      }

      toast.success(`Tool successfully ${tool ? "updated" : "created"}`)
    })
  }

  React.useEffect(() => {
    form.reset(nullsToUndefined(tool))
  }, [tool, form])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cx("grid grid-cols-1 gap-4 max-w-3xl sm:grid-cols-2", className)}
        noValidate
        {...props}
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
          name="bump"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bump</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            <FormItem className="col-span-full">
              <FormLabel>Submitter Note</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
                <Input
                  type="number"
                  {...field}
                  onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                />
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
          name="publishedAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Published At</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={field.value ? formatDate(field.value, "yyyy-MM-dd HH:mm") : undefined}
                  onChange={e => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Alternatives</FormLabel>

          <RelationSelector
            relations={alternatives}
            selectedIds={selectedAlternatives}
            onChange={setSelectedAlternatives}
          />
        </FormItem>

        <FormItem>
          <FormLabel>Categories</FormLabel>

          <RelationSelector
            relations={categories}
            selectedIds={selectedCategories}
            onChange={setSelectedCategories}
          />
        </FormItem>

        <div className="flex justify-end gap-2 col-span-full">
          <Button variant="outline" asChild>
            <Link href="/tools">Cancel</Link>
          </Button>

          <Button isPending={isSubmitPending} disabled={isSubmitPending}>
            {tool ? "Update tool" : "Create tool"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
