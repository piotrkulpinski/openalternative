import type { Prisma } from "@prisma/client"
import type { SearchParams } from "nuqs"
import { ToolListing, type ToolListingProps } from "~/components/web/tools/tool-listing"
import { filterParamsCache } from "~/server/web/shared/schema"
import type { FilterSchema } from "~/server/web/shared/schema"
import { searchTools } from "~/server/web/tools/queries"

type ToolQueryProps = Omit<ToolListingProps, "list" | "pagination"> & {
  searchParams: Promise<SearchParams>
  overrideParams?: Partial<FilterSchema>
  where?: Prisma.ToolWhereInput
}

const ToolQuery = async ({ searchParams, where, overrideParams, ...props }: ToolQueryProps) => {
  const parsedParams = filterParamsCache.parse(await searchParams)
  const params = { ...parsedParams, ...overrideParams }
  const { tools, totalCount } = await searchTools(params, where)

  return (
    <ToolListing
      list={{ tools }}
      pagination={{ totalCount, pageSize: params.perPage }}
      {...props}
    />
  )
}

export { ToolQuery }
