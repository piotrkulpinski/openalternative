import { useFetcher, useLocation } from "@remix-run/react"
import { ComponentProps, HTMLAttributes, useId } from "react"
import { Button } from "./Button"
import { H5 } from "./Heading"
import { Input } from "./forms/Input"
import { action } from "~/routes/api.subscribe"
import { Series } from "./Series"

type NewsletterProps = HTMLAttributes<HTMLElement> & {
  title?: string
  description?: string
  placeholder?: string
  buttonVariant?: ComponentProps<typeof Button>["variant"]
}

export const Newsletter = ({
  title,
  description,
  placeholder = "Enter your email...",
  buttonVariant,
  ...props
}: NewsletterProps) => {
  const id = useId()
  const { key } = useLocation()
  const { data, state, Form } = useFetcher<typeof action>({ key: `${id}-${key}` })

  return (
    <Series size="lg" direction="column" asChild>
      <section {...props}>
        {title && <H5 className="font-medium">{title}</H5>}
        {description && <p className="-mt-2 text-sm text-neutral-500">{description}</p>}

        <div className="space-y-2">
          {data?.type !== "success" && (
            <Form
              method="POST"
              action="/api/subscribe"
              className="relative w-full max-w-xs"
              noValidate
            >
              <Input
                type="email"
                name="email"
                placeholder={placeholder}
                data-1p-ignore
                required
                className="pr-24"
              />

              <Button
                size="sm"
                variant={buttonVariant}
                isPending={state !== "idle"}
                className="absolute inset-y-1 right-1"
              >
                Subscribe
              </Button>
            </Form>
          )}

          {data?.type === "error" && (
            <p className="text-xs text-red-600">{data.error.email?._errors[0]}</p>
          )}
          {data?.type === "success" && <p className="text-sm text-green-600">{data.message}</p>}
        </div>
      </section>
    </Series>
  )
}
