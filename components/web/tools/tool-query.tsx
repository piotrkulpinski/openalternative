"use client"

import { useQueryStates } from "nuqs"
import { Suspense } from "react"
import { Pagination } from "~/components/web/pagination"
import { ToolFilters } from "~/components/web/tools/tool-filters"
import { ToolList } from "~/components/web/tools/tool-list"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { Input } from "~/components/web/ui/input"
import type { AdOne } from "~/server/ads/payloads"
import type { CategoryMany } from "~/server/categories/payloads"
import type { ToolMany } from "~/server/tools/payloads"
import { toolsSearchParams } from "~/server/tools/search-params"

type ToolQueryProps = {
  tools: ToolMany[]
  ad?: AdOne | null
  categories?: CategoryMany[]
  totalCount: number
  placeholder?: string
}

const ToolQuery = ({ tools, totalCount, ad, categories, placeholder }: ToolQueryProps) => {
  const [{ perPage }] = useQueryStates(toolsSearchParams)

  return (
    <>
      <div className="flex flex-col gap-5">
        <ToolFilters categories={categories} placeholder={placeholder} />
        <ToolList tools={tools} ad={ad} />
      </div>

      <Suspense>
        <Pagination pageSize={perPage} totalCount={totalCount} />
      </Suspense>
    </>
  )
}

const ToolQuerySkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <Input size="lg" placeholder="Loading..." disabled />
      <ToolListSkeleton />
    </div>
  )
}

export { ToolQuery, ToolQuerySkeleton }
