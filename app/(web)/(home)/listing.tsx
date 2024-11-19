import type { Prisma } from "@prisma/client"
import type { SearchParams } from "nuqs/server"
import type { ComponentProps } from "react"
import { Tools } from "~/components/web/tools/tools"
import { findCategories } from "~/server/categories/queries"
import { searchTools } from "~/server/tools/queries"

type ToolsListingProps = Omit<
  ComponentProps<typeof Tools>,
  "tools" | "categories" | "totalCount"
> & {
  searchParams: Promise<SearchParams>
  where?: Prisma.ToolWhereInput
}

export const ToolsListing = async ({ searchParams, where, ...props }: ToolsListingProps) => {
  const [{ tools, totalCount }, categories] = await Promise.all([
    searchTools(await searchParams, { where }),
    findCategories({}),
  ])

  return (
    <Tools
      tools={tools}
      totalCount={totalCount}
      categories={where?.categories ? undefined : categories}
      {...props}
    />
  )
}
