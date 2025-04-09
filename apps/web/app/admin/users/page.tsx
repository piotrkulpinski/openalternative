import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findUsers } from "~/server/admin/users/queries"
import { usersTableParamsCache } from "~/server/admin/users/schemas"
import { UsersTable } from "./_components/users-table"

type UsersPageProps = {
  searchParams: Promise<SearchParams>
}

const UsersPage = async ({ searchParams }: UsersPageProps) => {
  const search = usersTableParamsCache.parse(await searchParams)
  const usersPromise = findUsers(search)

  return (
    <Suspense fallback={<DataTableSkeleton title="Users" />}>
      <UsersTable usersPromise={usersPromise} />
    </Suspense>
  )
}

export default withAdminPage(UsersPage)
