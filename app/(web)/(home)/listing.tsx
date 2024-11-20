import type { Prisma } from "@prisma/client"
import type { SearchParams } from "nuqs/server"
import type { ComponentProps } from "react"
import { ToolList } from "~/components/web/tools/tool-list"
import { findCategories } from "~/server/categories/queries"
import { searchTools } from "~/server/tools/queries"

type ToolListingProps = Omit<
  ComponentProps<typeof ToolList>,
  "tools" | "categories" | "totalCount"
> & {
  searchParams: Promise<SearchParams>
  where?: Prisma.ToolWhereInput
}

export const ToolListing = async ({ searchParams, where, ...props }: ToolListingProps) => {
  const [{ tools, totalCount }, categories] = await Promise.all([
    searchTools(await searchParams, { where }),
    findCategories({}),
  ])

  return (
    <ToolList
      tools={tools}
      totalCount={totalCount}
      categories={where?.categories ? undefined : categories}
      {...props}
    />
  )
}
