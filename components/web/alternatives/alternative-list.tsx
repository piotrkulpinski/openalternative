"use client"

import { useQueryStates } from "nuqs"
import { Box } from "~/components/common/box"
import {
  AlternativeCard,
  AlternativeCardSkeleton,
} from "~/components/web/alternatives/alternative-card"
import {
  AlternativeFilters,
  type AlternativeFiltersProps,
} from "~/components/web/alternatives/alternative-filters"
import { EmptyList } from "~/components/web/empty-list"
import { Pagination } from "~/components/web/pagination"
import { Grid } from "~/components/web/ui/grid"
import type { AlternativeMany } from "~/server/alternatives/payloads"
import { alternativesSearchParams } from "~/server/alternatives/search-params"

type AlternativeListProps = AlternativeFiltersProps & {
  alternatives: AlternativeMany[]
  totalCount: number
}

const AlternativeList = ({ alternatives, totalCount, ...props }: AlternativeListProps) => {
  const [{ q, perPage }] = useQueryStates(alternativesSearchParams)

  return (
    <>
      <div className="flex flex-col gap-6 lg:gap-8">
        <AlternativeFilters {...props} />

        <Grid>
          {alternatives.map(alternative => (
            <AlternativeCard key={alternative.id} alternative={alternative} showCount />
          ))}

          {!alternatives.length && (
            <EmptyList>No alternatives found{q ? ` for "${q}"` : ""}.</EmptyList>
          )}
        </Grid>
      </div>

      <Pagination pageSize={perPage} totalCount={totalCount} />
    </>
  )
}

const AlternativeListSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <Box className="px-4 py-2.5 text-sm/normal rounded-lg w-full">
        <span>&nbsp;</span>
      </Box>

      <Grid>
        {[...Array(6)].map((_, index) => (
          <AlternativeCardSkeleton key={index} />
        ))}
      </Grid>
    </div>
  )
}

export { AlternativeList, AlternativeListSkeleton }
