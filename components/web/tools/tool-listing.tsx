import { Input } from "~/components/common/input"
import { Pagination, type PaginationProps } from "~/components/web/pagination"
import { ToolList, type ToolListProps } from "~/components/web/tools/tool-list"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { ToolSearch, type ToolSearchProps } from "~/components/web/tools/tool-search"
import { FiltersProvider, type FiltersProviderProps } from "~/contexts/filter-context"

export type ToolListingProps = {
  list: ToolListProps
  pagination: PaginationProps
  search?: ToolSearchProps
  options?: FiltersProviderProps
}

const ToolListing = ({ list, pagination, options, search }: ToolListingProps) => {
  return (
    <FiltersProvider {...options}>
      <div className="flex flex-col gap-5" id="tools">
        <ToolSearch {...search} />
        <ToolList {...list} />
      </div>

      <Pagination {...pagination} />
    </FiltersProvider>
  )
}

const ToolListingSkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <Input size="lg" placeholder="Loading..." disabled />
      <ToolListSkeleton />
    </div>
  )
}

export { ToolListing, ToolListingSkeleton }
