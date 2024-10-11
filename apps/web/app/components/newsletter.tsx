import { useFetcher, useLocation } from "@remix-run/react"
import { type ComponentProps, type HTMLAttributes, useId } from "react"
import { Box } from "~/components/ui/box"
import { Button } from "~/components/ui/button"
import { ErrorMessage } from "~/components/ui/forms/error-message"
import { Input } from "~/components/ui/forms/input"
import { H5 } from "~/components/ui/heading"
import { Stack } from "~/components/ui/stack"
import type { action } from "~/routes/api.subscribe"
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
  placeholder = "Your email here...",
  size = "md",
  buttonProps = { size: "sm", children: "Subscribe" },
  ...props
}: NewsletterProps) => {
  const id = useId()
  const { key } = useLocation()
  const { data, state, Form } = useFetcher<typeof action>({ key: `${id}-${key}` })
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

        {data?.type !== "success" && (
          <Box focusWithin>
            <Form
              method="POST"
              action="/api/subscribe"
              className="flex rounded-lg overflow-clip"
              noValidate
            >
              <input type="hidden" name="utm_medium" value={medium} />

              <Input
                type="email"
                name="email"
                placeholder={placeholder}
                data-1p-ignore
                required
                size={size}
                className="flex-1 min-w-0 border-0 outline-0 !ring-0"
              />

              <Button
                isPending={state !== "idle"}
                className={cx("shrink-0 ", isLargeSize ? "text-sm/tight px-4 m-1" : "px-3 m-0.5")}
                {...buttonProps}
              />
            </Form>
          </Box>
        )}

        {data?.type === "error" && (
          <>
            <ErrorMessage errors={data.error.formErrors} className="-mt-1" />

            {Object.values(data.error.fieldErrors).map((errors, index) => (
              <ErrorMessage key={index} errors={errors} className="-mt-1" />
            ))}
          </>
        )}

        {data?.type === "success" && <p className="text-sm text-green-600">{data.message}</p>}

        {children}
      </section>
    </Stack>
  )
}
