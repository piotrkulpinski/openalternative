"use client"

import { useQueryStates } from "nuqs"
import { Suspense } from "react"
import { AlternativeFilters } from "~/components/web/alternatives/alternative-filters"
import {
  AlternativeList,
  AlternativeListSkeleton,
} from "~/components/web/alternatives/alternative-list"
import { Pagination } from "~/components/web/pagination"
import { Input } from "~/components/web/ui/input"
import type { AlternativeMany } from "~/server/alternatives/payloads"
import { alternativesSearchParams } from "~/server/alternatives/search-params"

type AlternativeQueryProps = {
  alternatives: AlternativeMany[]
  totalCount: number
  placeholder?: string
}

const AlternativeQuery = ({ alternatives, totalCount, placeholder }: AlternativeQueryProps) => {
  const [{ perPage }] = useQueryStates(alternativesSearchParams)

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
