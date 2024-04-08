import { Form } from "@remix-run/react"
import { HTMLAttributes, SyntheticEvent, useRef } from "react"
import queryString from "query-string"
import { useLocalStorage } from "@uidotdev/usehooks"
import { cx } from "~/utils/cva"
import { Select } from "~/components/forms/Select"
import { Input } from "~/components/forms/Input"
import { PanelLeftCloseIcon, PanelLeftOpenIcon, SearchIcon } from "lucide-react"
import { Button } from "~/components/Button"
import { useToolsContext, toolsSearchParamsSchema } from "~/store/tools"
import { AdvancedFilters } from "./AdvancedFilters"

export const Filters = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  const submitRef = useRef<HTMLButtonElement>(null)
  const searchParams = useToolsContext((s) => s.searchParams)
  const setSearchParams = useToolsContext((s) => s.setSearchParams)
  const [isFiltersOpen, setIsFiltersOpen] = useLocalStorage("filtersOpen", false)
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
    const searchParams = toolsSearchParamsSchema.parse({
      page: formData.get("page"),
      query: formData.get("query"),
      order: formData.get("order"),
      language: formData.getAll("language"),
    })
    setSearchParams(searchParams)

    // Store the search params in the URL
    window.history.pushState(null, "", `?${queryString.stringify(searchParams)}`)
  }

  return (
    <Form
      onSubmit={handleSubmit}
      className={cx("flex flex-wrap gap-x-2 gap-y-3 w-full", className)}
      {...props}
    >
      <Button
        type="button"
        size="md"
        variant="secondary"
        prefix={isFiltersOpen ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
        onClick={() => setIsFiltersOpen((prev) => !prev)}
      >
        Filters
      </Button>

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

      <div className="relative flex-1 max-sm:w-40">
        <Input
          name="query"
          defaultValue={query ?? undefined}
          placeholder="Search tools"
          className="!pr-6 w-full"
        />

        <SearchIcon className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex size-[1em] opacity-60 pointer-events-none" />
      </div>

      {query && order && <input type="hidden" name="order" value={order} />}
      <button type="submit" ref={submitRef} className="hidden" />

      {children}

      {isFiltersOpen && <AdvancedFilters submitRef={submitRef} />}
    </Form>
  )
}
