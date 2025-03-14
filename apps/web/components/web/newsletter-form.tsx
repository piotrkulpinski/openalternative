"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { posthog } from "posthog-js"
import type { ComponentProps } from "react"
import { useForm } from "react-hook-form"
import { useServerAction } from "zsa-react"
import { subscribeToNewsletter } from "~/actions/subscribe"
import { Box } from "~/components/common/box"
import { Button } from "~/components/common/button"
import { Form, FormControl, FormField } from "~/components/common/form"
import { Hint } from "~/components/common/hint"
import { Input } from "~/components/common/input"
import { type NewsletterSchema, newsletterSchema } from "~/server/web/shared/schemas"
import { cx } from "~/utils/cva"

type ButtonProps = ComponentProps<typeof Button>
type InputProps = ComponentProps<typeof Input>

type NewsletterFormProps = ComponentProps<"form"> & {
  medium?: string
  placeholder?: string
  size?: InputProps["size"]
  buttonProps?: ButtonProps
}

export const NewsletterForm = ({
  children,
  className,
  medium = "subscribe_form",
  placeholder = "Enter your email",
  size = "md",
  buttonProps = { size: "sm", children: "Subscribe" },
  ...props
}: NewsletterFormProps) => {
  const form = useForm<NewsletterSchema>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { captcha: "", value: "", utm_medium: medium },
  })

  const { data, error, isPending, execute } = useServerAction(subscribeToNewsletter, {
    onSuccess: () => {
      posthog.capture("subscribe_newsletter", { email: form.getValues("value") })
      form.reset()
    },

    onError: () => form.reset(),
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(data => execute(data))}
        className={cx("flex flex-col gap-3 w-full", className)}
        noValidate
        {...props}
      >
        <FormField
          control={form.control}
          name="captcha"
          render={({ field }) => (
            <FormControl>
              <Input type="hidden" {...field} />
            </FormControl>
          )}
        />

        <Box focusWithin>
          <div className="flex w-full rounded-lg overflow-clip">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormControl>
                  <Input
                    type="email"
                    placeholder={placeholder}
                    required
                    size={size}
                    className="flex-1 min-w-0 border-0 focus-visible:ring-transparent"
                    data-1p-ignore
                    {...field}
                  />
                </FormControl>
              )}
            />

            <Button
              isPending={isPending}
              className={cx(
                "shrink-0",
                size === "lg" ? "text-sm/tight px-4 py-2 m-1" : "px-3 py-1.5 m-0.5",
              )}
              {...buttonProps}
            />
          </div>
        </Box>

        {(error || form.formState.errors.value) && (
          <Hint className="-mt-1">{(error || form.formState.errors.value)?.message}</Hint>
        )}

        {data && <p className="text-sm text-green-600">{data}</p>}

        {children}
      </form>
    </Form>
  )
}
