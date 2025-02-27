import type { SearchParams } from "nuqs/server"
import { AlternativeQuery } from "~/components/web/alternatives/alternative-query"
import { searchAlternatives } from "~/server/web/alternatives/queries"
import { filterSearchParamsCache } from "~/server/web/shared/schemas"

type AlternativeListingProps = {
  searchParams: Promise<SearchParams>
}

export const AlternativeListing = async ({ searchParams }: AlternativeListingProps) => {
  const parsedParams = filterSearchParamsCache.parse(await searchParams)
  const { alternatives, totalCount } = await searchAlternatives(parsedParams)

  return (
    <AlternativeQuery
      alternatives={alternatives}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in ${totalCount} alternatives...`}
    />
  )
}
