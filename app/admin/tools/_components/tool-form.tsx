"use client"

import { formatDateTime, getRandomString, isValidUrl, slugify } from "@curiousleaf/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Tool, ToolStatus } from "@prisma/client"
import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"
import { use, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { generateFavicon, generateScreenshot } from "~/actions/media"
import { ToolActions } from "~/app/admin/tools/_components/tool-actions"
import { ToolGenerateContent } from "~/app/admin/tools/_components/tool-generate-content"
import { ToolPublishActions } from "~/app/admin/tools/_components/tool-publish-actions"
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
import { H3 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Input, inputVariants } from "~/components/common/input"
import { Link } from "~/components/common/link"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { Switch } from "~/components/common/switch"
import { TextArea } from "~/components/common/textarea"
import { ExternalLink } from "~/components/web/external-link"
import { Markdown } from "~/components/web/markdown"
import { siteConfig } from "~/config/site"
import { useComputedField } from "~/hooks/use-computed-field"
import { isToolPublished } from "~/lib/tools"
import type { findAlternativeList } from "~/server/admin/alternatives/queries"
import type { findCategoryList } from "~/server/admin/categories/queries"
import { upsertTool } from "~/server/admin/tools/actions"
import type { findToolBySlug } from "~/server/admin/tools/queries"
import { toolSchema } from "~/server/admin/tools/schema"
import { cx } from "~/utils/cva"

const ToolStatusChange = ({ tool }: { tool: Tool }) => {
  return (
    <>
      <ExternalLink href={`/${tool.slug}`} className="font-semibold underline inline-block">
        {tool.name}
      </ExternalLink>{" "}
      is now {tool.status.toLowerCase()}.{" "}
      {tool.status === "Scheduled" && (
        <>
          Will be published on {formatDateTime(tool.publishedAt ?? new Date(), "long")} (
          {Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/^.+\//, "")}).
        </>
      )}
    </>
  )
}

type ToolFormProps = ComponentProps<"form"> & {
  tool?: NonNullable<Awaited<ReturnType<typeof findToolBySlug>>>
  alternativesPromise: ReturnType<typeof findAlternativeList>
  categoriesPromise: ReturnType<typeof findCategoryList>
}

export function ToolForm({
  children,
  className,
  title,
  tool,
  alternativesPromise,
  categoriesPromise,
  ...props
}: ToolFormProps) {
  const router = useRouter()
  const alternatives = use(alternativesPromise)
  const categories = use(categoriesPromise)

  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isStatusPending, setIsStatusPending] = useState(false)
  const [originalStatus, setOriginalStatus] = useState(tool?.status ?? ToolStatus.Draft)

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
      discountCode: tool?.discountCode ?? "",
      discountAmount: tool?.discountAmount ?? "",
      status: tool?.status ?? ToolStatus.Draft,
      publishedAt: tool?.publishedAt ?? null,
      alternatives: tool?.alternatives.map(a => a.id) ?? [],
      categories: tool?.categories.map(c => c.id) ?? [],
      notifySubmitter: true,
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

  // Keep track of the form values
  const [name, slug, websiteUrl, description, content] = form.watch([
    "name",
    "slug",
    "websiteUrl",
    "description",
    "content",
  ])

  // Upsert tool
  const upsertAction = useServerAction(upsertTool, {
    onSuccess: ({ data }) => {
      // If status has changed, show a status change notification
      if (data.status !== originalStatus) {
        toast.success(<ToolStatusChange tool={data} />)
        setOriginalStatus(data.status)
      }

      // Otherwise, just show a success message
      else {
        toast.success(`Tool successfully ${tool ? "updated" : "created"}`)
      }

      // If not updating a tool, or slug has changed, redirect to the new tool
      if (!tool || data.slug !== tool?.slug) {
        router.push(`/admin/tools/${data.slug}`)
      }
    },

    onError: ({ err }) => toast.error(err.message),
    onFinish: () => setIsStatusPending(false),
  })

  // Generate favicon
  const faviconAction = useServerAction(generateFavicon, {
    onSuccess: ({ data }) => {
      toast.success("Favicon successfully generated. Please save the tool to update.")
      form.setValue("faviconUrl", data)
    },

    onError: ({ err }) => toast.error(err.message),
  })

  // Generate screenshot
  const screenshotAction = useServerAction(generateScreenshot, {
    onSuccess: ({ data }) => {
      toast.success("Screenshot successfully generated. Please save the tool to update.")
      form.setValue("screenshotUrl", data)
    },

    onError: ({ err }) => toast.error(err.message),
  })

  const handleSubmit = form.handleSubmit((data, event) => {
    const submitter = (event?.nativeEvent as SubmitEvent)?.submitter
    const isStatusChange = submitter?.getAttribute("name") !== "submit"

    if (isStatusChange) {
      setIsStatusPending(true)
    }

    upsertAction.execute({ id: tool?.id, ...data })
  })

  const handleStatusSubmit = (status: ToolStatus, publishedAt: Date | null) => {
    // Update form values
    form.setValue("status", status)
    form.setValue("publishedAt", publishedAt)

    // Submit the form with updated values
    handleSubmit()
  }

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          <ToolGenerateContent />

          {tool && <ToolActions tool={tool} size="md" />}
        </Stack>

        {tool && (
          <Note className="w-full">
            {isToolPublished(tool) ? "View:" : "Preview:"}{" "}
            <ExternalLink href={`/${tool.slug}`} className="text-primary underline">
              {siteConfig.url}/{tool.slug}
            </ExternalLink>
            {tool.status === ToolStatus.Scheduled && tool.publishedAt && (
              <>
                <br />
                Scheduled to be published on{" "}
                <strong className="text-foreground">{formatDateTime(tool.publishedAt)}</strong>
              </>
            )}
          </Note>
        )}
      </Stack>

      <form
        onSubmit={handleSubmit}
        className={cx("grid gap-4 @sm:grid-cols-2", className)}
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

        <div className="grid gap-4 @2xl:grid-cols-2">
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

        <div className="grid gap-4 @2xl:grid-cols-2">
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
        </div>

        {tool?.submitterEmail && (
          <>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="faviconUrl"
          render={({ field }) => (
            <FormItem className="items-stretch">
              <Stack className="justify-between">
                <FormLabel className="flex-1">Favicon URL</FormLabel>

                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  prefix={
                    <Icon
                      name="lucide/refresh-cw"
                      className={cx(faviconAction.isPending && "animate-spin")}
                    />
                  }
                  className="-my-1"
                  disabled={!isValidUrl(websiteUrl) || faviconAction.isPending}
                  onClick={() => {
                    faviconAction.execute({
                      url: websiteUrl,
                      path: `tools/${slug || getRandomString(12)}`,
                    })
                  }}
                >
                  {field.value ? "Regenerate" : "Generate"}
                </Button>
              </Stack>

              <Stack size="sm">
                {field.value && (
                  <img
                    src={field.value}
                    alt="Favicon"
                    className="size-8 border box-content rounded-md object-contain"
                  />
                )}

                <FormControl>
                  <Input type="url" className="flex-1" {...field} />
                </FormControl>
              </Stack>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="screenshotUrl"
          render={({ field }) => (
            <FormItem className="items-stretch">
              <Stack className="justify-between">
                <FormLabel className="flex-1">Screenshot URL</FormLabel>

                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  prefix={
                    <Icon
                      name="lucide/refresh-cw"
                      className={cx(screenshotAction.isPending && "animate-spin")}
                    />
                  }
                  className="-my-1"
                  disabled={!isValidUrl(websiteUrl) || screenshotAction.isPending}
                  onClick={() => {
                    screenshotAction.execute({
                      url: websiteUrl,
                      path: `tools/${slug || getRandomString(12)}`,
                    })
                  }}
                >
                  {field.value ? "Regenerate" : "Generate"}
                </Button>
              </Stack>

              <Stack size="sm">
                {field.value && (
                  <img
                    src={field.value}
                    alt="Screenshot"
                    className="h-8 max-w-32 border box-content rounded-md object-contain"
                  />
                )}

                <FormControl>
                  <Input type="url" className="flex-1" {...field} />
                </FormControl>
              </Stack>

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
                relations={alternatives}
                selectedIds={field.value ?? []}
                setSelectedIds={field.onChange}
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
                relations={categories}
                selectedIds={field.value ?? []}
                setSelectedIds={field.onChange}
                mapFunction={({ id, name, fullPath }) => {
                  const depth = fullPath.split("/").length - 1
                  const prefix = "- ".repeat(depth)
                  return { id, name: `${prefix}${name}` }
                }}
                sortFunction={(a, b) => {
                  // Split paths into segments for comparison
                  const aSegments = a.fullPath.split("/")
                  const bSegments = b.fullPath.split("/")

                  // Compare each segment
                  for (let i = 0; i < Math.min(aSegments.length, bSegments.length); i++) {
                    if (aSegments[i] !== bSegments[i]) {
                      return aSegments[i].localeCompare(bSegments[i])
                    }
                  }

                  // If all segments match up to the shorter path length,
                  // the shorter path comes first
                  return aSegments.length - bSegments.length
                }}
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

          <ToolPublishActions
            tool={tool}
            isPending={!isStatusPending && upsertAction.isPending}
            isStatusPending={isStatusPending}
            onStatusSubmit={handleStatusSubmit}
          />
        </div>
      </form>
    </Form>
  )
}
