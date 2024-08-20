import { useFetcher, useLocation } from "@remix-run/react"
import { type ComponentProps, type HTMLAttributes, useId } from "react"
import { Button } from "~/components/Button"
import { H6 } from "~/components/Heading"
import { Series } from "~/components/Series"
import { ErrorMessage } from "~/components/forms/ErrorMessage"
import { Input } from "~/components/forms/Input"
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
    <Series size="lg" direction="column" asChild>
      <section {...props}>
        {title && (
          <H6 as="strong" className="font-medium">
            {title}
          </H6>
        )}

        {description && (
          <p className="-mt-2 text-sm text-muted text-balance first:mt-0">{description}</p>
        )}

        {data?.type !== "success" && (
          <Form
            method="POST"
            action="/api/subscribe"
            className={cx("relative w-full", isLargeSize ? "max-w-96" : "max-w-64")}
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
              className={isLargeSize ? "pr-28" : "pr-24"}
            />

            <Button
              isPending={state !== "idle"}
              className={cx("absolute inset-y-1 right-1", isLargeSize && "text-sm/tight min-w-24")}
              {...buttonProps}
            />
          </Form>
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
    </Series>
  )
}
