import { useFetcher } from "@remix-run/react"
import { cx } from "cva"
import { LoaderIcon } from "lucide-react"
import { HTMLAttributes } from "react"

export const Newsletter = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  const fetcher = useFetcher()
  const data = fetcher.data as { success: boolean; message: string } | undefined

  return (
    <section className={cx("mt-auto space-y-1", className)} {...props}>
      <h3 className="font-medium">Newsletter</h3>

      <p className="text-sm text-neutral-500">
        Get updates on new tools, alternatives, and other cool stuff.
      </p>

      <div className="!mt-4 space-y-2">
        {!data?.success && (
          <fetcher.Form
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

            <button className="absolute inset-y-1 right-1 inline-flex items-center justify-center rounded bg-current px-3 py-1 text-[13px] duration-200 hover:opacity-80">
              <span className="invert">
                {fetcher.state === "submitting" ? (
                  <LoaderIcon className="size-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </span>
            </button>
          </fetcher.Form>
        )}

        {data?.message && (
          <p className={cx("text-sm", data.success ? "text-green-600" : "text-red-600")}>
            {data.message}
          </p>
        )}
      </div>

      {children}
    </section>
  )
}
