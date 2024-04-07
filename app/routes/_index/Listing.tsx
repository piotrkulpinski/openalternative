import { useSearchParams } from "@remix-run/react"
import useSWR from "swr"
import { Grid } from "~/components/Grid"
import { Pagination } from "~/components/Pagination"
import { ToolRecord, ToolRecordSkeleton } from "~/components/records/ToolRecord"
import { ToolMany } from "~/services.server/api"
import { TOOLS_PER_PAGE } from "~/utils/constants"

export const Listing = () => {
  const [searchParams] = useSearchParams()

  const fetcher = async (url: string) => {
    const r = await fetch(url)
    return r.json()
  }

  const { data, error, isLoading } = useSWR<{ tools: ToolMany[]; toolCount: number }>(
    `/api/tools?${searchParams.toString()}`,
    fetcher,
    {
      refreshInterval: 1000 * 60,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
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
