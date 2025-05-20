import type { Prisma } from "@prisma/client"
import type { SearchParams } from "nuqs/server"
import type { AlternativeListProps } from "~/components/web/alternatives/alternative-list"
import {
  AlternativeListing,
  type AlternativeListingProps,
} from "~/components/web/alternatives/alternative-listing"
import type { PaginationProps } from "~/components/web/pagination"
import { searchAlternatives } from "~/server/web/alternatives/queries"
import { filterParamsCache } from "~/server/web/shared/schema"
import type { FilterSchema } from "~/server/web/shared/schema"

type AlternativeQueryProps = Omit<AlternativeListingProps, "list" | "pagination"> & {
  searchParams: Promise<SearchParams>
  overrideParams?: Partial<FilterSchema>
  where?: Prisma.AlternativeWhereInput
  list?: Partial<Omit<AlternativeListProps, "alternatives">>
  pagination?: Partial<Omit<PaginationProps, "totalCount" | "pageSize">>
}

const AlternativeQuery = async ({
  searchParams,
  overrideParams,
  where,
  list,
  pagination,
  ...props
}: AlternativeQueryProps) => {
  const parsedParams = filterParamsCache.parse(await searchParams)
  const params = { ...parsedParams, ...overrideParams }
  const { alternatives, totalCount } = await searchAlternatives(params, where)

  return (
    <AlternativeListing
      list={{ alternatives, ...list }}
      pagination={{ totalCount, pageSize: params.perPage, ...pagination }}
      {...props}
    />
  )
}

export { AlternativeQuery, type AlternativeQueryProps }
