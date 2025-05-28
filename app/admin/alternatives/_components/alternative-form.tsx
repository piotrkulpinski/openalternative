"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { getRandomString, isValidUrl, slugify } from "@primoui/utils"
import { useRouter } from "next/navigation"
import { type ComponentProps, use } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { generateFavicon } from "~/actions/media"
import { AlternativeActions } from "~/app/admin/alternatives/_components/alternative-actions"
import { AlternativeGenerateDescription } from "~/app/admin/alternatives/_components/alternative-generate-content"
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
import { Input } from "~/components/common/input"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { TextArea } from "~/components/common/textarea"
import { useComputedField } from "~/hooks/use-computed-field"
import { upsertAlternative } from "~/server/admin/alternatives/actions"
import type { findAlternativeBySlug } from "~/server/admin/alternatives/queries"
import { alternativeSchema } from "~/server/admin/alternatives/schema"
import type { findToolList } from "~/server/admin/tools/queries"
import { cx } from "~/utils/cva"

type AlternativeFormProps = ComponentProps<"form"> & {
  alternative?: Awaited<ReturnType<typeof findAlternativeBySlug>>
  toolsPromise: ReturnType<typeof findToolList>
}

export function AlternativeForm({
  children,
  className,
  title,
  alternative,
  toolsPromise,
  ...props
}: AlternativeFormProps) {
  const router = useRouter()
  const tools = use(toolsPromise)

  const form = useForm({
    resolver: zodResolver(alternativeSchema),
    defaultValues: {
      name: alternative?.name ?? "",
      slug: alternative?.slug ?? "",
      websiteUrl: alternative?.websiteUrl ?? "",
      description: alternative?.description ?? "",
      faviconUrl: alternative?.faviconUrl ?? "",
      discountCode: alternative?.discountCode ?? "",
      discountAmount: alternative?.discountAmount ?? "",
      tools: alternative?.tools.map(t => t.id) ?? [],
    },
  })

  // Set the slug based on the name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !alternative,
  })

  // Keep track of the form values
  const [slug, websiteUrl] = form.watch(["slug", "websiteUrl"])

  // Upsert alternative
  const upsertAction = useServerAction(upsertAlternative, {
    onSuccess: ({ data }) => {
      toast.success(`Alternative successfully ${alternative ? "updated" : "created"}`)

      // If not updating a alternative, or slug has changed, redirect to the new alternative
      if (!alternative || data.slug !== alternative?.slug) {
        router.push(`/admin/alternatives/${data.slug}`)
      }
    },

    onError: ({ err }) => toast.error(err.message),
  })

  // Generate favicon
  const faviconAction = useServerAction(generateFavicon, {
    onSuccess: ({ data }) => {
      toast.success("Favicon successfully generated. Please save the tool to update.")
      form.setValue("faviconUrl", data)
    },

    onError: ({ err }) => toast.error(err.message),
  })

  const handleSubmit = form.handleSubmit(data => {
    upsertAction.execute({ id: alternative?.id, ...data })
  })

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          <AlternativeGenerateDescription />

          {alternative && <AlternativeActions alternative={alternative} size="md" />}
        </Stack>
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

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="faviconUrl"
          render={({ field }) => (
            <FormItem className="items-stretch">
              <Stack className="justify-between">
                <FormLabel>Favicon URL</FormLabel>

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
                      path: `alternatives/${slug || getRandomString(12)}`,
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
          name="tools"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Tools</FormLabel>
              <RelationSelector
                relations={tools}
                selectedIds={field.value ?? []}
                setSelectedIds={field.onChange}
              />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/alternatives">Cancel</Link>
          </Button>

          <Button size="md" isPending={upsertAction.isPending}>
            {alternative ? "Update alternative" : "Create alternative"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
