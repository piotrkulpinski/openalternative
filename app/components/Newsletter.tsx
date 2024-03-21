import { useFetcher, useLocation } from "@remix-run/react"
import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { Button } from "./Button"
import { H5 } from "./Heading"
import { Input } from "./Input"
import { action } from "~/routes/api.subscribe"

export const Newsletter = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const { key } = useLocation()
  const { data, state, Form } = useFetcher<typeof action>({ key: `newsletter-${key}` })

  return (
    <section className={cx("space-y-1", className)} {...props}>
      <H5 className="font-medium">Newsletter</H5>

      <p className="text-sm text-neutral-500">
        Get updates on new tools, alternatives, and other cool stuff.
      </p>

      <div className="!mt-4 space-y-2">
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
              placeholder="Enter your email..."
              data-1p-ignore
              required
              className="pr-24"
            />

            <Button size="sm" isPending={state !== "idle"} className="absolute inset-y-1 right-1">
              Subscribe
            </Button>
          </Form>
        )}

        {data?.type === "error" && (
          <p className="text-sm text-red-600">{data.error.email?._errors[0]}</p>
        )}
        {data?.type === "success" && <p className="text-sm text-green-600">{data.message}</p>}
      </div>
    </section>
  )
}
