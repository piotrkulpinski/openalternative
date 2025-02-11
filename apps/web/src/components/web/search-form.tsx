"use client"

import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { parseAsString, useQueryState } from "nuqs"
import { type FormEvent, type HTMLAttributes, useEffect, useRef, useState } from "react"
import { Input } from "~/components/common/input"
import { cx } from "~/utils/cva"

export const SearchForm = ({ className, ...props }: HTMLAttributes<HTMLFormElement>) => {
  const router = useRouter()
  const [searchQuery] = useQueryState("q", parseAsString.withDefault(""))
  const [query, setQuery] = useState(searchQuery)
  const [isExpanded, setIsExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleExpand = () => {
    setIsExpanded(true)
    inputRef.current?.select()
  }

  const handleCollapse = () => {
    setIsExpanded(false)
    inputRef.current?.blur()
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push(`/?q=${query}`)
  }

  useEffect(() => {
    setQuery(searchQuery || "")
  }, [searchQuery])

  return (
    <form
      onSubmit={handleSubmit}
      className={cx("flex items-center shrink-0", className)}
      noValidate
      {...props}
    >
      <div className="relative flex">
        <Input
          size="sm"
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search tools..."
          className={cx(
            "transition-[width,opacity,transform] duration-200 ease-in-out",
            isExpanded ? "w-28 opacity-100" : "w-0 opacity-0",
          )}
          onFocus={handleExpand}
          onBlur={handleCollapse}
        />

        <button
          type="button"
          className={cx(
            "p-0.5 -m-0.5 text-muted-foreground hover:text-foreground duration-200 ease-in-out will-change-transform absolute inset-y-0 right-0",
            isExpanded ? "opacity-0 translate-x-1 pointer-events-none" : "opacity-100",
          )}
          onClick={handleExpand}
          tabIndex={-1}
          aria-label="Search"
        >
          <SearchIcon className="size-4" />
        </button>
      </div>
    </form>
  )
}
