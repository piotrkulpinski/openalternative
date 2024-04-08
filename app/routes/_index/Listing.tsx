import useSWR from "swr"
import { Grid } from "~/components/Grid"
import { Pagination } from "~/components/Pagination"
import { ToolRecord, ToolRecordSkeleton } from "~/components/records/ToolRecord"
import { ToolMany } from "~/services.server/api"
import { useToolsContext } from "~/store/tools"
import { SWR_CONFIG, TOOLS_PER_PAGE } from "~/utils/constants"
import { fetcher } from "~/utils/fetchers"

export const Listing = () => {
  const searchParams = useToolsContext((s) => s.searchParams)

  const { data, error, isLoading } = useSWR<{ tools: ToolMany[]; toolCount: number }>(
    { url: "/api/tools", ...searchParams },
    fetcher,
    SWR_CONFIG
  )

  if (isLoading) {
    return (
      <Grid>
        {Array.from({ length: 9 }).map((_, i) => (
          <ToolRecordSkeleton key={i} />
        ))}
      </Grid>
    )
  }

  if (error) {
    return <div>Failed to load</div>
  }

  if (!data?.toolCount) {
    return <p>No tools found.</p>
  }

  return (
    <>
      <Grid>
        {data.tools.map((tool) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}
      </Grid>

      <Pagination totalCount={data.toolCount} pageSize={TOOLS_PER_PAGE} />
    </>
  )
}
