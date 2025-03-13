import { ToolStatus } from "@openalternative/db/client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import type { DashboardPageProps } from "~/app/(web)/dashboard/page"
import { DashboardTable } from "~/app/(web)/dashboard/table"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { auth } from "~/lib/auth"
import { findTools } from "~/server/admin/tools/queries"
import { toolsTableParamsCache } from "~/server/admin/tools/schemas"

export const DashboardToolListing = async ({ searchParams }: DashboardPageProps) => {
  const parsedParams = toolsTableParamsCache.parse(await searchParams)
  const session = await auth.api.getSession({ headers: await headers() })
  const status = [ToolStatus.Draft, ToolStatus.Scheduled, ToolStatus.Published]

  if (!session?.user) {
    throw redirect("/auth/login?next=/dashboard")
  }

  const toolsPromise = findTools(
    { ...parsedParams, status: status },
    { OR: [{ submitterEmail: session.user.email }, { ownerId: session.user.id }] },
  )

  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <DashboardTable toolsPromise={toolsPromise} />
    </Suspense>
  )
}
