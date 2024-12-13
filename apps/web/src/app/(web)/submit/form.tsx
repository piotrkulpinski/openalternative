"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { posthog } from "posthog-js"
import type { HTMLAttributes } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { submitTool } from "~/actions/submit"
import { Checkbox } from "~/components/common/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { Hint } from "~/components/common/hint"
import { FeatureNudge } from "~/components/web/feature-nudge"
import { Button } from "~/components/web/ui/button"
import { Input } from "~/components/web/ui/input"
import { type SubmitToolSchema, submitToolSchema } from "~/server/schemas"
import { cx } from "~/utils/cva"

export const SubmitForm = ({ className, ...props }: HTMLAttributes<HTMLFormElement>) => {
  const router = useRouter()

  const form = useForm<SubmitToolSchema>({
    resolver: zodResolver(submitToolSchema),
    defaultValues: {
      name: "",
      website: "",
      repository: "",
      submitterName: "",
      submitterEmail: "",
      submitterNote: "",
      newsletterOptIn: true,
    },
  })

  const { error, execute, isPending } = useServerAction(submitTool, {
    onSuccess: ({ data }) => {
      form.reset()

      // Capture event
      posthog.capture("submit_tool", { slug: data.slug })

      if (data.publishedAt && data.publishedAt <= new Date()) {
        if (data.isFeatured) {
          toast.info(`${data.name} has already been published.`)
        } else {
          toast.custom(t => <FeatureNudge tool={data} t={t} />, {
            duration: Number.POSITIVE_INFINITY,
          })
        }
        router.push(`/tools/${data.slug}`)
      } else {
        toast.success(`${data.name} has been submitted.`)
        router.push(`/submit/${data.slug}`)
      }
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(data => execute(data))}
        className={cx("grid w-full gap-5 sm:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <FormField
          control={form.control}
          name="submitterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Your Name:</FormLabel>
              <FormControl>
                <Input type="text" size="lg" placeholder="John Doe" data-1p-ignore {...field} />
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
              <FormLabel isRequired>Your Email:</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  size="lg"
                  placeholder="john@doe.com"
                  data-1p-ignore
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Name:</FormLabel>
              <FormControl>
                <Input type="text" size="lg" placeholder="PostHog" data-1p-ignore {...field} />
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
              <FormLabel isRequired>Website URL:</FormLabel>
              <FormControl>
                <Input type="url" size="lg" placeholder="https://posthog.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repository"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel isRequired>Repository URL:</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  size="lg"
                  placeholder="https://github.com/posthog/posthog"
                  {...field}
                />
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
              <FormLabel>Suggest an alternative:</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  size="lg"
                  placeholder="Which well-known tool is this an alternative to?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newsletterOptIn"
          render={({ field }) => (
            <FormItem className="flex-row items-center col-span-full">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="font-normal">I'd like to receive free email updates</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-full">
          <Button
            variant="primary"
            isPending={isPending}
            disabled={isPending}
            className="flex min-w-32"
          >
            Submit
          </Button>
        </div>

        {error && <Hint className="col-span-full">{error.message}</Hint>}
      </form>
    </Form>
  )
}
