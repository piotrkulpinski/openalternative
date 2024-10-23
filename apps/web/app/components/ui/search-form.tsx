import { Form } from "@remix-run/react"
import { SearchIcon } from "lucide-react"
import { type HTMLAttributes, useRef, useState } from "react"
import { Input } from "~/components/ui/forms/input"
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
      <div className="relative flex">
        <Input
          ref={inputRef}
          name="openalternative[query]"
          size="sm"
          placeholder="Search tools..."
          className={cx(
            "transition-[width,opacity,transform] duration-200 ease-in-out",
            isExpanded ? "w-32 opacity-100" : "w-0 opacity-0",
          )}
          onFocus={handleExpand}
          onBlur={handleCollapse}
        />

        <button
          type="button"
          className={cx(
            "p-0.5 -m-0.5 text-muted hover:text-foreground duration-200 ease-in-out will-change-transform absolute inset-y-0 right-0",
            isExpanded ? "opacity-0 translate-x-1 pointer-events-none" : "opacity-100",
          )}
          onClick={handleExpand}
          tabIndex={-1}
          aria-label="Search"
        >
          <SearchIcon className="size-4" />
        </button>
      </div>
    </Form>
  )
}
