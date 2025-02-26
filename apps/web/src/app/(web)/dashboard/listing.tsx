import { ToolStatus } from "@openalternative/db/client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import type { DashboardPageProps } from "~/app/(web)/dashboard/page"
import { DashboardTable } from "~/app/(web)/dashboard/table"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { auth } from "~/lib/auth"
import { findTools } from "~/server/admin/tools/queries"
import { adminToolsSearchParams } from "~/server/admin/tools/schemas"

export const DashboardToolListing = async ({ params, searchParams }: DashboardPageProps) => {
  const { path } = await params
  const parsedParams = adminToolsSearchParams.parse(await searchParams)
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    throw redirect(`/auth/login?callbackURL=${encodeURIComponent("/dashboard")}`)
  }

  const { email, id } = session.user

  const toolsPromise = findTools(parsedParams, {
    // ...(path === "tools" && {
    AND: [
      { status: { notIn: [ToolStatus.Deleted] } },
      { OR: [{ submitterEmail: email }, { ownerId: id }] },
    ],
    // }),
  })

  return (
    <Suspense
      fallback={
        <DataTableSkeleton searchableColumnCount={1} filterableColumnCount={2} shrinkZero />
      }
    >
      <DashboardTable toolsPromise={toolsPromise} />
    </Suspense>
  )
}
