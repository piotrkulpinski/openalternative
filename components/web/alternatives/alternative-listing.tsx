import { Input } from "~/components/common/input"
import {
  AlternativeList,
  type AlternativeListProps,
  AlternativeListSkeleton,
} from "~/components/web/alternatives/alternative-list"
import {
  AlternativeSearch,
  type AlternativeSearchProps,
} from "~/components/web/alternatives/alternative-search"
import { Pagination, type PaginationProps } from "~/components/web/pagination"
import { FiltersProvider, type FiltersProviderProps } from "~/contexts/filter-context"

type AlternativeListingProps = {
  list: AlternativeListProps
  pagination: PaginationProps
  search?: AlternativeSearchProps
  options?: FiltersProviderProps
}

const AlternativeListing = ({ list, pagination, search, options }: AlternativeListingProps) => {
  return (
    <FiltersProvider {...options}>
      <div className="space-y-5" id="alternatives">
        <AlternativeSearch {...search} />
        <AlternativeList {...list} />
      </div>

      <Pagination {...pagination} />
    </FiltersProvider>
  )
}

const AlternativeListingSkeleton = () => {
  return (
    <div className="space-y-5">
      <Input size="lg" placeholder="Loading..." disabled />
      <AlternativeListSkeleton />
    </div>
  )
}

export { AlternativeListing, AlternativeListingSkeleton, type AlternativeListingProps }
