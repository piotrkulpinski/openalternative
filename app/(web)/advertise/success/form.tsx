"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { ComponentProps } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { createAdFromCheckout } from "~/actions/stripe"
import { Button } from "~/components/common/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { Input } from "~/components/common/input"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { TextArea } from "~/components/common/textarea"
import type { AdOne } from "~/server/web/ads/payloads"
import { type AdDetailsSchema, adDetailsSchema } from "~/server/web/shared/schema"
import { cx } from "~/utils/cva"

type AdDetailsFormProps = ComponentProps<"form"> & {
  sessionId: string
  ad?: AdOne | null
}

export const AdDetailsForm = ({ className, sessionId, ad, ...props }: AdDetailsFormProps) => {
  const form = useForm<AdDetailsSchema>({
    resolver: zodResolver(adDetailsSchema),
    defaultValues: {
      name: ad?.name ?? "",
      websiteUrl: ad?.websiteUrl ?? "",
      description: ad?.description ?? "",
      buttonLabel: ad?.buttonLabel ?? "",
    },
  })

  const { execute, isPending } = useServerAction(createAdFromCheckout, {
    onSuccess: () => {
      toast.success(`Advertisement ${ad ? "updated" : "created"} successfully!`)
    },
    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  const handleSubmit = form.handleSubmit(data => {
    execute({
      sessionId,
      ...data,
    })
  })

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className={cx("grid w-full gap-5 sm:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Name</FormLabel>
              <FormControl>
                <Input type="text" size="lg" placeholder="Product name" {...field} />
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
              <FormLabel isRequired>Website URL</FormLabel>
              <FormControl>
                <Input type="url" size="lg" placeholder="https://yourwebsite.com" {...field} />
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
              <Stack className="w-full justify-between">
                <FormLabel isRequired>Description</FormLabel>
                <Note className="text-xs">Max. 160 chars</Note>
              </Stack>
              <FormControl>
                <TextArea size="lg" placeholder="Brief description of your product" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="buttonLabel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Button Label</FormLabel>
              <FormControl>
                <Input type="text" size="lg" placeholder="Get started for free" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="col-span-full" isPending={isPending}>
          {ad ? "Update Ad" : "Create Ad"}
        </Button>
      </form>
    </Form>
  )
}
