import type { Prisma } from "@prisma/client"
import type { SearchParams } from "nuqs/server"
import { AlternativeList } from "~/components/web/alternatives/alternative-list"
import { searchAlternatives } from "~/server/alternatives/queries"

type ToolListingProps = {
  searchParams: Promise<SearchParams>
  where?: Prisma.AlternativeWhereInput
}

export const AlternativeListing = async ({ searchParams, where }: ToolListingProps) => {
  const { alternatives, totalCount } = await searchAlternatives(await searchParams, { where })

  return <AlternativeList alternatives={alternatives} totalCount={totalCount} />
}
