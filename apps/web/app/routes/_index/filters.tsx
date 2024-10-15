import { useLocalStorage, useMediaQuery } from "@uidotdev/usehooks"
import { PanelBottomCloseIcon, PanelBottomOpenIcon } from "lucide-react"
import { posthog } from "posthog-js"
import type { HTMLAttributes } from "react"
import { Button } from "~/components/ui/button"
import { HitsPerPage } from "~/routes/_index/hits-per-page"
import { cx } from "~/utils/cva"
import { Refinements } from "./refinements"
import { SearchBox } from "./search-box"
import { SortBy } from "./sort-by"

export const Filters = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const isMobile = useMediaQuery("only screen and (max-width : 768px)")
  const [isFiltersOpen, setIsFiltersOpen] = useLocalStorage("filtersOpen", false)

  const sortByItems = [
    { value: "openalternative", label: "Default" },
    { value: "openalternative_published_desc", label: "Latest" },
    { value: "openalternative_name_asc", label: "Name" },
    { value: "openalternative_stars_desc", label: "Stars" },
    { value: "openalternative_forks_desc", label: "Forks" },
    { value: "openalternative_lastcommit_desc", label: "Last Commit" },
  ]

  const hitsPerPageItems = [
    { value: 17, label: "18 per page", default: isMobile },
    { value: 35, label: "36 per page", default: !isMobile },
    { value: 71, label: "72 per page" },
  ]

  const onToggleFilters = () => {
    // Toggle the filters
    setIsFiltersOpen(prev => !prev)

    // Send the event to the posthog
    posthog.capture("toggle_filters")
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cx("flex flex-wrap gap-x-2 gap-y-3 w-full md:flex-nowrap", className)}
        {...props}
      >
        <SearchBox className="w-full md:max-w-[calc(66%+6px)]" />
        <SortBy items={sortByItems} className="flex-1" />
        <HitsPerPage items={hitsPerPageItems} className="hidden" />

        <Button
          type="button"
          size="md"
          variant="secondary"
          suffix={isFiltersOpen ? <PanelBottomOpenIcon /> : <PanelBottomCloseIcon />}
          onClick={onToggleFilters}
          className="flex-1"
        >
          {isFiltersOpen ? "Hide" : "Show"} Filters
        </Button>
      </div>

      <Refinements className={cx(!isFiltersOpen && "hidden")} />
    </div>
  )
}
