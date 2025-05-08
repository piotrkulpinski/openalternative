import type { Prisma } from "@prisma/client"
import type { SearchParams } from "nuqs/server"
import {
  AlternativeListing,
  type AlternativeListingProps,
} from "~/components/web/alternatives/alternative-listing"
import { searchAlternatives } from "~/server/web/alternatives/queries"
import { filterParamsCache } from "~/server/web/shared/schema"
import type { FilterSchema } from "~/server/web/shared/schema"

type AlternativeQueryProps = Omit<AlternativeListingProps, "list" | "pagination"> & {
  searchParams: Promise<SearchParams>
  overrideParams?: Partial<FilterSchema>
  where?: Prisma.AlternativeWhereInput
}

const AlternativeQuery = async ({
  searchParams,
  overrideParams,
  where,
  ...props
}: AlternativeQueryProps) => {
  const parsedParams = filterParamsCache.parse(await searchParams)
  const params = { ...parsedParams, ...overrideParams }
  const { alternatives, totalCount } = await searchAlternatives(params, where)

  return (
    <AlternativeListing
      list={{ alternatives }}
      pagination={{ totalCount, pageSize: params.perPage }}
      {...props}
    />
  )
}

export { AlternativeQuery, type AlternativeQueryProps }
