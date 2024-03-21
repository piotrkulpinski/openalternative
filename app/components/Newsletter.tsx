import { useFetcher } from "@remix-run/react"
import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { Button } from "./Button"
import { H5 } from "./Heading"

export const Newsletter = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const { data, state, Form } = useFetcher<{ success: boolean; message: string }>()

  return (
    <section className={cx("space-y-1", className)} {...props}>
      <H5 className="font-medium">Newsletter</H5>

      <p className="text-sm text-neutral-500">
        Get updates on new tools, alternatives, and other cool stuff.
      </p>

      <div className="!mt-4 space-y-2">
        {!data?.success && (
          <Form
            method="POST"
            action="/api/subscribe"
            className="relative w-full max-w-xs"
            noValidate
          >
            <input
              name="email"
              type="email"
              className="w-full rounded-md border bg-transparent px-3 py-2 pr-24 text-[13px] font-medium placeholder:text-inherit placeholder:opacity-40 disabled:opacity-50 dark:border-neutral-700"
              placeholder="Enter your email..."
              data-1p-ignore
              required
            />

            <Button size="sm" isPending={state !== "idle"} className="absolute inset-y-1 right-1">
              Subscribe
            </Button>
          </Form>
        )}

        {data?.message && (
          <p className={cx("text-sm", data.success ? "text-green-600" : "text-red-600")}>
            {data.message}
          </p>
        )}
      </div>
    </section>
  )
}
