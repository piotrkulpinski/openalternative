"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { formatDate } from "date-fns"
import { PlusIcon, TrashIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import type React from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { createTool, updateTool } from "~/app/(dashboard)/tools/_lib/actions"
import type {
  getAlternatives,
  getCategories,
  getToolById,
} from "~/app/(dashboard)/tools/_lib/queries"
import { type ToolSchema, toolSchema } from "~/app/(dashboard)/tools/_lib/validations"
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
import { Switch } from "~/components/ui/switch"
import { Textarea } from "~/components/ui/textarea"
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
  const form = useForm<ToolSchema>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      ...nullsToUndefined(tool),
      alternatives: tool?.alternatives?.map(({ alternative }) => alternative.id),
      categories: tool?.categories?.map(({ category }) => category.id),
    },
  })

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({ control: form.control, name: "links" })

  // Create tool
  const { execute: createToolAction, isPending: isCreatingTool } = useServerAction(createTool, {
    onSuccess: ({ data }) => {
      toast.success("Tool successfully created")
      redirect(`/tools/${data.id}`)
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  // Update tool
  const { execute: updateToolAction, isPending: isUpdatingTool } = useServerAction(updateTool, {
    onSuccess: ({ data }) => {
      toast.success("Tool successfully updated")
      redirect(`/tools/${data.id}`)
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

        <div className="flex flex-row gap-4 max-sm:contents">
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
        </div>

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
          name="twitterHandle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter Handle</FormLabel>
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
          name="links"
          render={() => (
            <FormItem className="col-span-full">
              <FormLabel>Links</FormLabel>
              <div className="space-y-2">
                {linkFields.map((field, index) => (
                  <div key={field.id} className="flex flex-wrap items-center gap-2 md:gap-4">
                    <FormField
                      control={form.control}
                      name={`links.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input placeholder="Name" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`links.${index}.url`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input placeholder="URL" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      prefix={<TrashIcon />}
                      onClick={() => removeLink(index)}
                      className="text-destructive"
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  prefix={<PlusIcon />}
                  onClick={() => appendLink({ name: "", url: "" })}
                >
                  Add Link
                </Button>
              </div>
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
                relations={alternatives}
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
                relations={categories}
                selectedIds={field.value ?? []}
                onChange={field.onChange}
              />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button variant="outline" asChild>
            <Link href="/tools">Cancel</Link>
          </Button>

          <Button isPending={isPending} disabled={isPending}>
            {tool ? "Update tool" : "Create tool"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
