"use client"

import type { User } from "@openalternative/db/client"
import { useQueryStates } from "nuqs"
import { use, useMemo, useState } from "react"
import { UsersDeleteDialog } from "~/app/admin/users/_components/users-delete-dialog"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableHeader } from "~/components/data-table/data-table-header"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { DataTableViewOptions } from "~/components/data-table/data-table-view-options"
import { useDataTable } from "~/hooks/use-data-table"
import type { findUsers } from "~/server/admin/users/queries"
import { usersTableParamsSchema } from "~/server/admin/users/schemas"
import type { DataTableFilterField, DataTableRowAction } from "~/types"
import { getColumns } from "./users-table-columns"
import { UsersTableToolbarActions } from "./users-table-toolbar-actions"

type UsersTableProps = {
  usersPromise: ReturnType<typeof findUsers>
}

export function UsersTable({ usersPromise }: UsersTableProps) {
  const { users, usersTotal, pageCount } = use(usersPromise)
  const [{ perPage, sort }] = useQueryStates(usersTableParamsSchema)
  const [rowAction, setRowAction] = useState<DataTableRowAction<User> | null>(null)

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns({ setRowAction }), [])

  // Search filters
  const filterFields: DataTableFilterField<User>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Search by name or email...",
    },
  ]

  const { table } = useDataTable({
    data: users,
    columns,
    pageCount,
    filterFields,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: perPage },
      sorting: sort,
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  })

  return (
    <>
      <DataTable table={table}>
        <DataTableHeader title="Users" total={usersTotal}>
          <DataTableToolbar table={table} filterFields={filterFields}>
            <UsersTableToolbarActions table={table} />
            <DateRangePicker align="end" />
            <DataTableViewOptions table={table} />
          </DataTableToolbar>
        </DataTableHeader>
      </DataTable>

      <UsersDeleteDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        users={rowAction?.data ? [rowAction?.data] : []}
        showTrigger={false}
        onSuccess={() => table.toggleAllRowsSelected(false)}
      />
    </>
  )
}
