import type { SearchParams } from "nuqs"
import { AlternativeQuery } from "~/components/web/alternatives/alternative-query"
import { searchAlternatives } from "~/server/alternatives/queries"

type AlternativeListingProps = {
  searchParams: Promise<SearchParams>
}

export const AlternativeListing = async ({ searchParams }: AlternativeListingProps) => {
  const { alternatives, totalCount } = await searchAlternatives(searchParams, {})

  return <AlternativeQuery alternatives={alternatives} totalCount={totalCount} />
}
