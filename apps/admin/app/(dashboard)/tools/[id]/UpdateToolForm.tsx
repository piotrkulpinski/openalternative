"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { formatDate } from "date-fns"
import Link from "next/link"
import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { updateTool } from "~/app/(dashboard)/tools/lib/actions"
import type {
  getAlternatives,
  getCategories,
  getToolById,
} from "~/app/(dashboard)/tools/lib/queries"
import { type UpdateToolSchema, updateToolSchema } from "~/app/(dashboard)/tools/lib/validations"
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
import { nullsToUndefined } from "~/utils/helpers"

interface UpdateToolFormProps extends React.HTMLAttributes<HTMLFormElement> {
  tool: NonNullable<Awaited<ReturnType<typeof getToolById>>>
  alternatives: Awaited<ReturnType<typeof getAlternatives>>
  categories: Awaited<ReturnType<typeof getCategories>>
}

export function UpdateToolForm({ tool, alternatives, categories, ...props }: UpdateToolFormProps) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition()

  const form = useForm<UpdateToolSchema>({
    resolver: zodResolver(updateToolSchema),
    defaultValues: nullsToUndefined(tool),
  })

  React.useEffect(() => {
    form.reset(nullsToUndefined(tool))
  }, [tool, form])

  const [selectedAlternatives, setSelectedAlternatives] = React.useState<string[]>(
    tool.alternatives?.map(alt => alt.alternative.id) || [],
  )

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    tool.categories?.map(cat => cat.category.id) || [],
  )

  function onSubmit(input: UpdateToolSchema) {
    startUpdateTransition(async () => {
      const { error } = await updateTool(tool.id, {
        ...input,
        alternatives: {
          // Delete existing relations
          deleteMany: { toolId: tool.id },
          // Create new relations
          create: selectedAlternatives.map(id => ({
            alternative: {
              connect: { id },
            },
          })),
        },
        categories: {
          // Delete existing relations
          deleteMany: { toolId: tool.id },
          // Create new relations
          create: selectedCategories.map(id => ({
            category: {
              connect: { id },
            },
          })),
        },
      })

      if (error) {
        toast.error(error)
        return
      }

      form.reset()
      toast.success("Tool successfully updated")

      // Redirect to the tools page
      // redirect("/tools")
    })
  }

  console.log(form.formState.errors)

  return (
    <Form {...form} {...props}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 max-w-3xl sm:grid-cols-2"
        noValidate
      >
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

        <div className="flex justify-end gap-2 col-span-full">
          <Button variant="outline" asChild>
            <Link href="/tools">Cancel</Link>
          </Button>

          <Button isPending={isUpdatePending} disabled={isUpdatePending}>
            Update tool
          </Button>
        </div>
      </form>
    </Form>
  )
}
