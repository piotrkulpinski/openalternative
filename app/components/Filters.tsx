import { Form, useLocation, useNavigation, useSearchParams } from "@remix-run/react"
import { HTMLAttributes, useMemo, useRef } from "react"
import { cx } from "~/utils/cva"
import { Select } from "./forms/Select"
import { Input } from "./forms/Input"
import { LoaderIcon, SearchIcon } from "lucide-react"

export const Filters = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const { key } = useLocation()
  const { state } = useNavigation()
  const formRef = useRef<HTMLFormElement>(null)
  const [params] = useSearchParams()
  const query = useMemo(() => params.get("query") ?? undefined, [params])
  const order = useMemo(() => params.get("order") ?? undefined, [params])

  const orderOptions = [
    { value: "score", label: "Score" },
    { value: "name", label: "Name" },
    { value: "stars", label: "Stars" },
    { value: "forks", label: "Forks" },
    { value: "commit", label: "Last Commit" },
  ]

  return (
    <Form key={key} ref={formRef} className={cx("flex gap-2 lg:flex-1", className)} {...props}>
      <div className={cx("relative flex-1 max-sm:w-40", className)} {...props}>
        <Input
          name="query"
          defaultValue={query}
          placeholder="Search tools"
          className="!pr-6 w-full outline-none"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={typeof query !== "undefined"}
        />

        <div className="absolute right-2 top-1/2 p-0.5 -translate-y-1/2 inline-flex opacity-60 pointer-events-none">
          {state === "loading" ? (
            <LoaderIcon className="size-[1em] animate-spin" />
          ) : (
            <SearchIcon className="size-[1em]" />
          )}
        </div>
      </div>

      <Select
        name="order"
        defaultValue={order ?? ""}
        disabled={!!query}
        onChange={() => formRef.current?.submit()}
      >
        <option value="" disabled>
          Order by
        </option>

        {orderOptions.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      {query && order && <input type="hidden" name="order" value={order} />}
    </Form>
  )
}
