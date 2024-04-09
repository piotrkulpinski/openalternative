import { HTMLAttributes } from "react"
import { useLocalStorage, useMediaQuery } from "@uidotdev/usehooks"
import { cx } from "~/utils/cva"
import { PanelBottomCloseIcon, PanelBottomOpenIcon } from "lucide-react"
import { useInstantSearch } from "react-instantsearch"
import { Button } from "~/components/Button"
import { Refinements } from "./Refinements"
import { SearchBox } from "./SearchBox"
import { SortBy } from "./SortBy"
import { HitsPerPage } from "./HitsPerPage"

export const Filters = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const isMobile = useMediaQuery("only screen and (max-width : 768px)")
  const [isFiltersOpen, setIsFiltersOpen] = useLocalStorage("filtersOpen", false)
  const { results } = useInstantSearch()

  const sortByItems = [
    { value: "openalternative", label: "Relevance" },
    { value: "openalternative_name_asc", label: "Name" },
    { value: "openalternative_stars_desc", label: "Stars" },
    { value: "openalternative_forks_desc", label: "Forks" },
    { value: "openalternative_lastcommit_desc", label: "Last Commit" },
  ]

  const hitsPerPageItems = [
    { value: 18, label: "18 per page", default: isMobile },
    { value: 36, label: "36 per page", default: !isMobile },
    { value: 72, label: "72 per page" },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className={cx("flex flex-wrap gap-x-2 gap-y-3 w-full", className)} {...props}>
        <Button
          type="button"
          size="md"
          variant="secondary"
          prefix={isFiltersOpen ? <PanelBottomOpenIcon /> : <PanelBottomCloseIcon />}
          onClick={() => setIsFiltersOpen((prev) => !prev)}
        >
          {isFiltersOpen ? "Hide" : "Show"} Filters
        </Button>

        <SortBy items={sortByItems} />
        <HitsPerPage items={hitsPerPageItems} />
        <SearchBox className="flex-1" />
      </div>

      {isFiltersOpen && (
        <>
          <Refinements />

          <div className="flex items-center justify-between gap-4 text-xs text-neutral-500">
            <p>
              Found <strong className="font-medium text-black">{results?.nbHits}</strong> results in{" "}
              {results?.processingTimeMS}ms
            </p>

            <p className="inline-flex items-center gap-0.5">
              Search by{" "}
              <img
                src="/algolia.svg"
                alt="Algolia"
                width={77}
                height={19}
                className="h-4 opacity-50"
              />
            </p>
          </div>
        </>
      )}
    </div>
  )
}
