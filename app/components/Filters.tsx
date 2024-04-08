import { Form } from "@remix-run/react"
import { HTMLAttributes, SyntheticEvent, useRef } from "react"
import qs from "qs"
import { cx } from "~/utils/cva"
import { Select } from "./forms/Select"
import { Input } from "./forms/Input"
import { PanelLeftOpenIcon, SearchIcon } from "lucide-react"
import { Button } from "./Button"
import { useToolsContext, toolsSearchParamsSchema } from "~/store/tools"

export const Filters = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const submitRef = useRef<HTMLButtonElement>(null)
  const searchParams = useToolsContext((s) => s.searchParams)
  const setSearchParams = useToolsContext((s) => s.setSearchParams)
  const { query, order } = searchParams

  const orderOptions = [
    { value: "score", label: "Score" },
    { value: "name", label: "Name" },
    { value: "stars", label: "Stars" },
    { value: "forks", label: "Forks" },
    { value: "commit", label: "Last Commit" },
  ]

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)
    const params = Object.fromEntries(formData.entries())
    const searchParams = toolsSearchParamsSchema.parse(params)
    setSearchParams(searchParams)

    // Store the search params in the URL
    window.history.pushState(null, "", `?${qs.stringify(searchParams)}`)
  }

  return (
    <Form onSubmit={handleSubmit} className={cx("flex gap-2 lg:flex-1", className)} {...props}>
      <Button size="md" variant="secondary" prefix={<PanelLeftOpenIcon />}>
        Filters
      </Button>

      <div className={cx("relative flex-1 max-sm:w-40", className)} {...props}>
        <Input
          name="query"
          defaultValue={query}
          placeholder="Search tools"
          className="!pr-6 w-full"
        />

        <SearchIcon className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex size-[1em] opacity-60 pointer-events-none" />
      </div>

      <Select
        name="order"
        defaultValue={order ?? ""}
        disabled={!!query}
        onChange={() => submitRef.current?.click()}
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
      <button type="submit" ref={submitRef} className="hidden" />
    </Form>
  )
}
