import { LoaderIcon, SearchIcon, XIcon } from "lucide-react"
import { HTMLAttributes, useState } from "react"
import {
  useInstantSearch,
  useSearchBox,
  type UseSearchBoxProps,
} from "react-instantsearch-hooks-web"
import { Input } from "~/components/forms/Input"
import { cx } from "~/utils/cva"

type SearchBoxProps = HTMLAttributes<HTMLElement> & UseSearchBoxProps

export const SearchBox = ({ className, ...props }: SearchBoxProps) => {
  const { query, refine } = useSearchBox(props)
  const { status } = useInstantSearch()
  const [inputValue, setInputValue] = useState(query)
  const isSearchStalled = status === "stalled"

  const setQuery = (newQuery: string) => {
    setInputValue(newQuery)
    refine(newQuery)
  }

  return (
    <form
      role="search"
      noValidate
      className={cx("relative", className)}
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()

        setQuery(inputValue)
      }}
      onReset={(event) => {
        event.preventDefault()
        event.stopPropagation()

        setQuery("")
      }}
    >
      <Input
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="Search tools"
        className="!pr-12 w-full"
        spellCheck={false}
        maxLength={512}
        value={inputValue}
        onChange={(event) => {
          setQuery(event.currentTarget.value)
        }}
      />

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {!!inputValue.length && !isSearchStalled && (
          <button type="reset" className="opacity-60 hover:opacity-100">
            <XIcon className="size-4" />
          </button>
        )}

        {isSearchStalled && <LoaderIcon className="size-4 animate-spin" />}

        <button className="opacity-60 hover:opacity-100">
          <SearchIcon className="size-4" />
        </button>
      </div>
    </form>
  )
}
