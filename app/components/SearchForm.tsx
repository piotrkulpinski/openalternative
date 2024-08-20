import { Form } from "@remix-run/react"
import { SearchIcon } from "lucide-react"
import { type HTMLAttributes, useRef, useState } from "react"
import { Input } from "~/components/forms/Input"
import { cx } from "~/utils/cva"

export const SearchForm = ({ className, ...props }: HTMLAttributes<HTMLFormElement>) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleExpand = () => {
    setIsExpanded(true)
    inputRef.current?.focus()
  }

  const handleCollapse = () => {
    setIsExpanded(false)
  }

  return (
    <Form
      method="get"
      action="/"
      className={cx("flex items-center shrink-0", className)}
      {...props}
    >
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          name="openalternative[query]"
          size="sm"
          placeholder="Search"
          className={cx(
            "duration-200 ease-in-out",
            isExpanded ? "w-24 opacity-100" : "w-0 opacity-0",
          )}
          onFocus={handleExpand}
          onBlur={handleCollapse}
        />

        <button
          type="button"
          className={cx(
            "p-1 text-muted hover:text-foreground duration-200 ease-in-out absolute right-0",
            isExpanded ? "opacity-0 translate-x-0.5 pointer-events-none" : "opacity-100",
          )}
          onClick={handleExpand}
          tabIndex={-1}
        >
          <SearchIcon className="size-4" />
        </button>
      </div>
    </Form>
  )
}
