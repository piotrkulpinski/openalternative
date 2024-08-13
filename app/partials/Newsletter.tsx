import { useFetcher, useLocation } from "@remix-run/react"
import { posthog } from "posthog-js"
import { type ComponentProps, type HTMLAttributes, type ReactNode, useEffect, useId } from "react"
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
  placeholder?: string
  size?: InputProps["size"]
  buttonLabel?: ReactNode
  buttonVariant?: ButtonProps["variant"]
}

export const Newsletter = ({
  children,
  title,
  description,
  placeholder = "Your email here...",
  size = "sm",
  buttonLabel = "Subscribe",
  buttonVariant,
  ...props
}: NewsletterProps) => {
  const id = useId()
  const { key } = useLocation()
  const { data, state, Form } = useFetcher<typeof action>({ key: `${id}-${key}` })
  const isSmallSize = size === "sm"

  useEffect(() => {
    if (data?.type === "success") posthog.capture("subscribed")
  }, [data])

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
            className={cx("relative w-full", isSmallSize ? "max-w-64" : "max-w-96")}
            noValidate
          >
            <Input
              type="email"
              name="email"
              placeholder={placeholder}
              data-1p-ignore
              required
              size={size}
              className={isSmallSize ? "pr-24" : "pr-28"}
            />

            <Button
              size={size}
              variant={buttonVariant}
              isPending={state !== "idle"}
              className={cx("absolute inset-y-1 right-1", !isSmallSize && "text-sm/tight min-w-24")}
            >
              {buttonLabel}
            </Button>
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
