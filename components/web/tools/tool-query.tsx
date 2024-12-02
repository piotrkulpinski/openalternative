import { Suspense } from "react"
import { Pagination } from "~/components/web/pagination"
import { ToolFilters } from "~/components/web/tools/tool-filters"
import { ToolList } from "~/components/web/tools/tool-list"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { Input } from "~/components/web/ui/input"
import type { CategoryMany } from "~/server/categories/payloads"
import type { ToolMany } from "~/server/tools/payloads"

type ToolQueryProps = {
  tools: ToolMany[]
  categories?: CategoryMany[]
  totalCount: number
  perPage: number
  placeholder?: string
}

const ToolQuery = ({ tools, totalCount, categories, placeholder, perPage }: ToolQueryProps) => {
  return (
    <>
      <div className="flex flex-col gap-5">
        <ToolFilters categories={categories} placeholder={placeholder} />
        <ToolList tools={tools} />
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
