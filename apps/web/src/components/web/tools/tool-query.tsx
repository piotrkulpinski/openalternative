import { ClientOnly } from "~/components/web/client-only"
import { Pagination } from "~/components/web/pagination"
import { ToolList } from "~/components/web/tools/tool-list"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { ToolSearch } from "~/components/web/tools/tool-search"
import { Input } from "~/components/web/ui/input"
import type { ToolMany } from "~/server/web/tools/payloads"

type ToolQueryProps = {
  tools: ToolMany[]
  perPage: number
  totalCount: number
  placeholder?: string
}

const ToolQuery = ({ tools, perPage, totalCount, placeholder }: ToolQueryProps) => {
  return (
    <>
      <div className="flex flex-col gap-5" id="tools">
        <ClientOnly fallback={<Input size="lg" placeholder="Loading..." disabled />}>
          <ToolSearch placeholder={placeholder} />
        </ClientOnly>

        <ToolList tools={tools} />
      </div>

      <Pagination pageSize={perPage} totalCount={totalCount} />
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
