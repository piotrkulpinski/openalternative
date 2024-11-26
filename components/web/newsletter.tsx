"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { ComponentProps, HTMLAttributes } from "react"
import { useForm } from "react-hook-form"
import { useServerAction } from "zsa-react"
import { subscribeToNewsletter } from "~/actions/subscribe"
import { Box } from "~/components/common/box"
import { Form, FormControl, FormField } from "~/components/common/form"
import { H5 } from "~/components/common/heading"
import { Hint } from "~/components/common/hint"
import { Stack } from "~/components/common/stack"
import { Button } from "~/components/web/ui/button"
import { Input } from "~/components/web/ui/input"
import { type NewsletterSchema, newsletterSchema } from "~/server/schemas"
import { cx } from "~/utils/cva"

type ButtonProps = ComponentProps<typeof Button>
type InputProps = ComponentProps<typeof Input>

type NewsletterProps = HTMLAttributes<HTMLElement> & {
  title?: string
  description?: string
  medium?: string
  placeholder?: string
  size?: InputProps["size"]
  buttonProps?: ButtonProps
}

export const Newsletter = ({
  children,
  title,
  description,
  medium = "subscribe_form",
  placeholder = "Enter your email",
  size = "md",
  buttonProps = { size: "sm", children: "Subscribe" },
  ...props
}: NewsletterProps) => {
  const form = useForm<NewsletterSchema>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "", utm_medium: medium },
  })

  const { data, error, isPending, execute } = useServerAction(subscribeToNewsletter, {
    onSuccess: () => {
      form.reset()
    },
  })

  const isLargeSize = size === "lg"

  return (
    <Stack
      size="lg"
      direction="column"
      className={cx("items-stretch min-w-0", isLargeSize ? "max-w-sm" : "max-w-64")}
      asChild
    >
      <section {...props}>
        {title && (
          <H5 as="strong" className="px-0.5 font-medium">
            {title}
          </H5>
        )}

        {description && <p className="-mt-2 px-0.5 text-sm text-muted first:mt-0">{description}</p>}

        {!data && (
          <Form {...form}>
            <Box focusWithin>
              <form
                onSubmit={form.handleSubmit(data => execute(data))}
                className="flex rounded-lg overflow-clip"
                noValidate
              >
                <input type="hidden" name="utm_medium" value={medium} />

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
                  className={cx("shrink-0 ", isLargeSize ? "text-sm/tight px-4 m-1" : "px-3 m-0.5")}
                  {...buttonProps}
                />
              </form>
            </Box>
          </Form>
        )}

        {error && <Hint className="-mt-1">Error</Hint>}

        {data && <p className="text-sm text-green-600">{data}</p>}

        {children}
      </section>
    </Stack>
  )
}
