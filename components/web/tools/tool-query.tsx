import { Input } from "~/components/common/input"
import { Pagination } from "~/components/web/pagination"
import { ToolList, type ToolListProps } from "~/components/web/tools/tool-list"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { ToolSearch } from "~/components/web/tools/tool-search"
import { FiltersProvider, type FiltersProviderProps } from "~/contexts/filter-context"

type ToolQueryProps = ToolListProps &
  FiltersProviderProps & {
    perPage: number
    totalCount: number
    placeholder?: string
  }

const ToolQuery = ({
  perPage,
  totalCount,
  placeholder,
  enableSort,
  enableFilters,
  ...props
}: ToolQueryProps) => {
  return (
    <FiltersProvider enableSort={enableSort} enableFilters={enableFilters}>
      <div className="flex flex-col gap-5" id="tools">
        <ToolSearch placeholder={placeholder} />
        <ToolList {...props} />
      </div>

      <Pagination pageSize={perPage} totalCount={totalCount} />
    </FiltersProvider>
  )
}

const ToolQuerySkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <Input size="lg" placeholder="Loading..." disabled />
      <ToolListSkeleton />
    </div>
  )
}

export { ToolQuery, ToolQuerySkeleton, type ToolQueryProps }
