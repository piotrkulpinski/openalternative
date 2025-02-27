import { Input } from "~/components/common/input"
import {
  AlternativeList,
  AlternativeListSkeleton,
} from "~/components/web/alternatives/alternative-list"
import { AlternativeSearch } from "~/components/web/alternatives/alternative-search"
import { Pagination } from "~/components/web/pagination"
import { FiltersProvider } from "~/contexts/filter-context"
import type { AlternativeMany } from "~/server/web/alternatives/payloads"

type AlternativeQueryProps = {
  alternatives: AlternativeMany[]
  perPage: number
  totalCount: number
  placeholder?: string
}

const AlternativeQuery = ({
  alternatives,
  perPage,
  totalCount,
  placeholder,
}: AlternativeQueryProps) => {
  return (
    <>
      <FiltersProvider>
        <div className="flex flex-col gap-5">
          <AlternativeSearch placeholder={placeholder} />
          <AlternativeList alternatives={alternatives} />
        </div>
      </FiltersProvider>

      <Pagination pageSize={perPage} totalCount={totalCount} />
    </>
  )
}

const AlternativeQuerySkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <Input size="lg" placeholder="Loading..." disabled />
      <AlternativeListSkeleton />
    </div>
  )
}

export { AlternativeQuery, AlternativeQuerySkeleton }
