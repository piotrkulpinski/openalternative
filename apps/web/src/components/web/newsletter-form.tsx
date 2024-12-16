"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { posthog } from "posthog-js"
import type { ComponentProps, HTMLAttributes } from "react"
import { useForm } from "react-hook-form"
import { useServerAction } from "zsa-react"
import { subscribeToNewsletter } from "~/actions/subscribe"
import { Box } from "~/components/common/box"
import { Form, FormControl, FormField } from "~/components/common/form"
import { Hint } from "~/components/common/hint"
import { Button } from "~/components/web/ui/button"
import { Input } from "~/components/web/ui/input"
import { type NewsletterSchema, newsletterSchema } from "~/server/schemas"
import { cx } from "~/utils/cva"

type ButtonProps = ComponentProps<typeof Button>
type InputProps = ComponentProps<typeof Input>

type NewsletterFormProps = HTMLAttributes<HTMLElement> & {
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
    defaultValues: { email: "", utm_medium: medium },
  })

  const { data, error, isPending, execute } = useServerAction(subscribeToNewsletter, {
    onSuccess: () => {
      posthog.capture("subscribe_newsletter", { email: form.getValues("email") })
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
        <Box focusWithin>
          <div className="flex w-full rounded-lg overflow-clip">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormControl>
                  <Input
                    type="email"
                    placeholder={placeholder}
                    required
                    size={size}
                    className="flex-1 min-w-0 border-0 outline-0 ring-0!"
                    data-1p-ignore
                    {...field}
                  />
                </FormControl>
              )}
            />

            <Button
              isPending={isPending}
              disabled={isPending}
              className={cx("shrink-0 ", size === "lg" ? "text-sm/tight px-4 m-1" : "px-3 m-0.5")}
              {...buttonProps}
            />
          </div>
        </Box>

        {(error || form.formState.errors.email) && (
          <Hint className="-mt-1">{(error || form.formState.errors.email)?.message}</Hint>
        )}

        {data && <p className="text-sm text-green-600">{data}</p>}

        {children}
      </form>
    </Form>
  )
}
