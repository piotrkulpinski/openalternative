import { Suspense } from "react"
import { AlternativeFilters } from "~/components/web/alternatives/alternative-filters"
import {
  AlternativeList,
  AlternativeListSkeleton,
} from "~/components/web/alternatives/alternative-list"
import { Pagination } from "~/components/web/pagination"
import { Input } from "~/components/web/ui/input"
import type { AlternativeMany } from "~/server/alternatives/payloads"

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
      <div className="flex flex-col gap-5">
        <AlternativeFilters placeholder={placeholder} />
        <AlternativeList alternatives={alternatives} />
      </div>

      <Suspense>
        <Pagination pageSize={perPage} totalCount={totalCount} />
      </Suspense>
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
