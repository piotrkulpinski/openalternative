import { HTMLAttributes } from "react"
import { useLocalStorage, useMediaQuery } from "@uidotdev/usehooks"
import { cx } from "~/utils/cva"
import { PanelBottomCloseIcon, PanelBottomOpenIcon } from "lucide-react"
import { Button } from "~/components/Button"
import { Refinements } from "./Refinements"
import { SearchBox } from "./SearchBox"
import { SortBy } from "./SortBy"
import { HitsPerPage } from "./HitsPerPage"

export const Filters = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const isMobile = useMediaQuery("only screen and (max-width : 768px)")
  const [isFiltersOpen, setIsFiltersOpen] = useLocalStorage("filtersOpen", false)

  const sortByItems = [
    { value: "openalternative", label: "Default" },
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
    <>
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

      {isFiltersOpen && <Refinements />}
    </>
  )
}
