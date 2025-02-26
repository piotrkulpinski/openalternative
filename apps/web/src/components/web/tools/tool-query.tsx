import { Input } from "~/components/common/input"
import { Pagination } from "~/components/web/pagination"
import { ToolList, type ToolListProps } from "~/components/web/tools/tool-list"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { ToolSearch } from "~/components/web/tools/tool-search"
import { ToolFiltersProvider, type ToolFiltersProviderProps } from "~/contexts/tool-filter-context"

type ToolQueryProps = ToolListProps &
  ToolFiltersProviderProps & {
    perPage: number
    totalCount: number
    placeholder?: string
  }

const ToolQuery = ({ tools, perPage, totalCount, placeholder, ...props }: ToolQueryProps) => {
  return (
    <ToolFiltersProvider {...props}>
      <div className="flex flex-col gap-5" id="tools">
        <ToolSearch placeholder={placeholder} />
        <ToolList tools={tools} />
      </div>

      <Pagination pageSize={perPage} totalCount={totalCount} />
    </ToolFiltersProvider>
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
