import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findUsers } from "~/server/admin/users/queries"
import { usersTableParamsCache } from "~/server/admin/users/schemas"
import { UsersTable } from "./_components/users-table"

type UsersPageProps = {
  searchParams: Promise<SearchParams>
}

export default async function UsersPage(props: UsersPageProps) {
  const searchParams = await props.searchParams
  const search = usersTableParamsCache.parse(searchParams)
  const usersPromise = findUsers(search)

  return (
    <Suspense fallback={<DataTableSkeleton title="Users" />}>
      <UsersTable usersPromise={usersPromise} />
    </Suspense>
  )
}
