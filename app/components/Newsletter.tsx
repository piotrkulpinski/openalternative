import { cx } from "cva"
import { FormEventHandler, HTMLAttributes, useState } from "react"
import { Loader } from "./Loader"

export const Newsletter = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  const [responseMessage, setResponseMessage] = useState("")
  const [isPending, setPending] = useState(false)

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault()
    setPending(true)

    const formData = new FormData(e.target as HTMLFormElement)

    const response = await fetch("/api/subscribe", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.message) {
      setResponseMessage(data.message)
      setPending(false)
    }
  }

  return (
    <section className={cx("mt-auto space-y-1", className)} {...props}>
      <h3 className="font-medium">Newsletter</h3>

      <p className="text-sm text-neutral-500">
        Get updates on new tools, alternatives, and other cool stuff.
      </p>

      <div className="!mt-4">
        {responseMessage && <p className="text-sm text-green-600">{responseMessage}</p>}

        {!responseMessage && (
          <form
            method="post"
            action="https://dashboard.mailerlite.com/jsonp/875209/forms/116159593851127329/subscribe"
            className="relative w-full max-w-xs"
            onSubmit={onSubmit}
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
              <span className="invert">{isPending ? <Loader /> : "Subscribe"}</span>
            </button>
          </form>
        )}
      </div>

      {children}
    </section>
  )
}
