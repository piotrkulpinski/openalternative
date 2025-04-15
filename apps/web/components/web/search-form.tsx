"use client"

import { useRouter } from "next/navigation"
import { parseAsString, useQueryState } from "nuqs"
import { type ComponentProps, type FormEvent, useEffect, useRef, useState } from "react"
import { Input } from "~/components/common/input"
import { cx } from "~/utils/cva"
import { Icon } from "../common/icon"

export const SearchForm = ({ className, ...props }: ComponentProps<"form">) => {
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
      className={cx("flex items-center", className)}
      noValidate
      {...props}
    >
      <div className="relative flex w-full">
        <Input
          ref={inputRef}
          size="sm"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search..."
          onFocus={handleExpand}
          onBlur={handleCollapse}
          className={cx(
            "transition-[max-width,opacity,transform] duration-200 ease-in-out max-sm:text-base max-sm:px-3 max-sm:py-2",
            isExpanded ? "sm:max-w-32 sm:opacity-100" : "sm:max-w-0 sm:opacity-0",
          )}
        />

        <button
          type="button"
          className={cx(
            "p-0.5 -m-0.5 text-muted-foreground hover:text-foreground duration-200 ease-in-out will-change-transform absolute inset-y-0 right-0 max-sm:hidden",
            isExpanded ? "sm:opacity-0 sm:translate-x-1 sm:pointer-events-none" : "sm:opacity-100",
          )}
          onClick={handleExpand}
          tabIndex={-1}
          aria-label="Search"
        >
          <Icon name="lucide/search" className="size-4" />
        </button>
      </div>
    </form>
  )
}
