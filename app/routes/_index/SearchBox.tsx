import { useDebounce } from "@uidotdev/usehooks"
import { LoaderIcon, SearchIcon, XIcon } from "lucide-react"
import { type HTMLAttributes, useEffect, useState } from "react"
import { type UseSearchBoxProps, useInstantSearch, useSearchBox } from "react-instantsearch"
import { Input } from "~/components/forms/Input"
import { cx } from "~/utils/cva"

type SearchBoxProps = HTMLAttributes<HTMLElement> & UseSearchBoxProps

export const SearchBox = ({ className, ...props }: SearchBoxProps) => {
  const { query, refine } = useSearchBox(props)
  const { status } = useInstantSearch()
  const [searchQuery, setSearchQuery] = useState(query)
  const debouncedSearchTerm = useDebounce(searchQuery, 250)
  const isSearchStalled = status === "stalled"

  useEffect(() => {
    refine(debouncedSearchTerm)
  }, [debouncedSearchTerm, refine])

  return (
    <form
      role="search"
      noValidate
      className={cx("relative", className)}
      onSubmit={e => e.preventDefault()}
      onReset={() => setSearchQuery("")}
    >
      <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 size-4 shrink-0 pointer-events-none" />

      <Input
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="Type to search…"
        className="w-full pl-9 pr-24 sm:pr-44"
        spellCheck={false}
        maxLength={512}
        value={searchQuery}
        onChange={e => setSearchQuery(e.currentTarget.value)}
      />

      <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
        {!!searchQuery.length && !isSearchStalled && (
          <button type="reset" className="opacity-60 pointer-events-auto hover:opacity-100">
            <XIcon className="size-4" />
          </button>
        )}

        {isSearchStalled && <LoaderIcon className="size-4 animate-spin" />}

        <p className="flex items-center text-xs gap-1.5 whitespace-nowrap">
          <span className="opacity-50 max-sm:hidden">Search by</span>

          <a
            href="https://www.algolia.com/developers/?utm_source=openalternative&utm_medium=referral"
            target="_blank"
            rel="noreferrer"
            className="text-foreground/50 pointer-events-auto hover:text-pink-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 601 138"
              className="h-[1.25em]"
              fill="currentColor"
            >
              <title>Algolia</title>
              <path d="M292.5 76.2V2.6c0-1-.9-1.7-1.9-1.6l-13.8 2.2c-.8.1-1.4.8-1.4 1.6v74.6c0 3.5 0 25.3 26.2 26.1.9 0 1.7-.7 1.7-1.6V92.8c0-.8-.6-1.5-1.4-1.6-9.4-1.2-9.4-13.1-9.4-15Zm227.4-46.6H506c-.9 0-1.6.7-1.6 1.6v72.7c0 .9.7 1.6 1.6 1.6h13.9c.9 0 1.6-.7 1.6-1.6V31.2c0-.9-.7-1.6-1.6-1.6ZM506 20.5h13.9c.9 0 1.6-.7 1.6-1.6V2.6c0-1-.9-1.7-1.9-1.6l-13.9 2.2c-.8.1-1.4.8-1.4 1.6v14.1c.1.9.8 1.6 1.7 1.6Zm-24 55.7V2.6c0-1-.9-1.7-1.9-1.6l-13.8 2.2c-.8.1-1.4.8-1.4 1.6v74.6c0 3.5 0 25.3 26.2 26.1.9 0 1.7-.7 1.7-1.6V92.8c0-.8-.6-1.5-1.4-1.6-9.4-1.2-9.4-13.1-9.4-15ZM445.9 40c-3-3.3-6.8-5.9-11.1-7.7-4.3-1.8-9.1-2.7-14.2-2.7s-9.9.9-14.2 2.7c-4.3 1.8-8 4.4-11.1 7.7-3.1 3.3-5.6 7.3-7.3 12-1.7 4.7-2.5 10.2-2.5 15.9 0 5.7.9 10.1 2.6 14.8 1.7 4.7 4.1 8.8 7.2 12.1 3.1 3.3 6.8 5.9 11.1 7.8 4.3 1.9 11 2.8 14.3 2.9 3.3 0 10-1 14.4-2.9 4.3-1.8 8-4.4 11.1-7.8 3.1-3.3 5.5-7.4 7.2-12.1 1.7-4.7 2.5-9.1 2.5-14.8 0-5.7-.9-11.3-2.7-15.9-1.8-4.7-4.2-8.7-7.3-12Zm-12.1 44.7c-3.1 4.3-7.5 6.5-13.1 6.5s-10-2.1-13.1-6.5c-3.1-4.3-4.7-9.3-4.7-16.7 0-7.3 1.5-13.4 4.7-17.7 3.1-4.3 7.5-6.4 13.1-6.4s10 2.1 13.1 6.4c3.1 4.3 4.7 10.4 4.7 17.7 0 7.4-1.6 12.4-4.7 16.7ZM244.4 29.6H231c-13.2 0-24.8 7-31.6 17.5-4 6.2-6.3 13.6-6.3 21.5 0 12.3 5.5 23.2 14.1 30.4.8.7 1.7 1.4 2.5 2 3.5 2.3 7.7 3.7 12.2 3.7h1.3c.2 0 .5 0 .7-.1h.3c.2 0 .5-.1.7-.1h.2c9-1.4 16.8-8.4 19.4-17.2V103c0 .9.7 1.6 1.6 1.6h13.8c.9 0 1.6-.7 1.6-1.6V31.2c0-.9-.7-1.6-1.6-1.6h-15.5Zm0 56.5c-3.3 2.8-7.6 3.8-12.3 4.1h-1c-11.5 0-21.1-9.8-21.1-21.7 0-2.8.5-5.5 1.5-7.9 3.1-8 10.6-13.6 19.4-13.6h13.5v39.1Zm338.7-56.5h-13.5c-13.2 0-24.8 7-31.6 17.5-4 6.2-6.3 13.6-6.3 21.5 0 12.3 5.5 23.2 14.1 30.4.8.7 1.7 1.4 2.5 2 3.5 2.3 7.7 3.7 12.2 3.7h1.3c.2 0 .5 0 .7-.1h.3c.2 0 .5-.1.7-.1h.2c9-1.4 16.8-8.4 19.4-17.2V103c0 .9.7 1.6 1.6 1.6h13.8c.9 0 1.6-.7 1.6-1.6V31.2c0-.9-.7-1.6-1.6-1.6h-15.4Zm0 56.5c-3.3 2.8-7.6 3.8-12.3 4.1h-1c-11.5 0-21.1-9.8-21.1-21.7 0-2.8.5-5.5 1.5-7.9 3.1-8 10.6-13.6 19.4-13.6h13.5v39.1Zm-224-56.5h-13.5c-13.2 0-24.8 7-31.6 17.5-3.2 5-5.4 10.8-6 17.1-.3 3-.3 6 0 8.9 1.2 10.4 6.3 19.6 13.8 25.8.8.7 1.7 1.4 2.5 2 3.5 2.3 7.7 3.7 12.2 3.7 4.9 0 9.5-1.6 13.2-4.4 4.5-3.2 7.9-7.8 9.4-13v16.7c0 6-1.6 10.5-4.7 13.5-3.2 3-8.5 4.5-15.9 4.5-3 0-7.9-.2-12.7-.7-.8-.1-1.5.4-1.7 1.2l-3.5 11.8c-.3.9.3 1.9 1.3 2.1 5.9.8 11.6 1.3 14.9 1.3 13.4 0 23.3-2.9 29.7-8.8 5.9-5.3 9.1-13.4 9.6-24.2V31.2c0-.9-.7-1.6-1.6-1.6h-15.4Zm0 17.5s.2 38 0 39.2c-3.3 2.7-7.4 3.7-11.9 4h-2.1c-11-.6-20.4-10.2-20.4-21.7 0-2.8.5-5.5 1.5-7.9 3.1-8 10.6-13.6 19.4-13.6h13.5ZM68.3 1C31 1 .6 31.1.1 68.2c-.5 37.8 30.1 69 67.8 69.3 11.7.1 22.9-2.8 32.9-8.2 1-.5 1.1-1.9.3-2.6l-6.4-5.7c-1.3-1.2-3.1-1.5-4.7-.8-7 3-14.5 4.5-22.3 4.4-30.5-.4-55.2-25.8-54.7-56.3.5-30.1 25.1-54.5 55.4-54.5h55.4v98.4L92.4 84.3c-1-.9-2.6-.7-3.4.4-5 6.7-13.3 10.8-22.4 10.2-12.7-.9-22.9-11.1-23.9-23.7-1.1-15.1 10.8-27.7 25.7-27.7 13.4 0 24.5 10.3 25.7 23.5.1 1.2.6 2.3 1.5 3l8.2 7.3c.9.8 2.4.3 2.6-.9.6-3.2.8-6.4.6-9.8-1.3-19.2-16.9-34.7-36.1-35.9-22-1.4-40.5 15.9-41.1 37.5-.6 21.1 16.7 39.2 37.8 39.7 8.8.2 16.9-2.6 23.5-7.4l41.1 36.4c1.8 1.6 4.5.3 4.5-2V3.6c0-1.4-1.2-2.6-2.6-2.6H68.3Z" />
            </svg>
          </a>
        </p>
      </div>
    </form>
  )
}
