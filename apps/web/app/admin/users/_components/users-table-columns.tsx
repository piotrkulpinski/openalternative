"use client"

import { formatDate } from "@curiousleaf/utils"
import type { User } from "@openalternative/db/client"
import type { ColumnDef } from "@tanstack/react-table"
import { UserActions } from "~/app/admin/users/_components/user-actions"
import { RowCheckbox } from "~/components/admin/row-checkbox"
import { Badge } from "~/components/common/badge"
import { Icon } from "~/components/common/icon"
import { Note } from "~/components/common/note"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"

export const getColumns = (): ColumnDef<User>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <RowCheckbox
          checked={table.getIsAllPageRowsSelected()}
          ref={input => {
            if (input) {
              input.indeterminate =
                table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
            }
          }}
          onChange={e => table.toggleAllPageRowsSelected(e.target.checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <RowCheckbox
          checked={row.getIsSelected()}
          onChange={e => row.toggleSelected(e.target.checked)}
          aria-label="Select row"
        />
      ),
      size: 0,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <DataTableLink href={`/admin/users/${row.original.id}`} title={row.original.name}>
          {row.original.banned && (
            <Badge
              size="sm"
              variant="outline"
              prefix={<Icon name="lucide/ban" />}
              className="text-red-500"
            >
              Banned
            </Badge>
          )}

          {row.original.role === "admin" && (
            <Badge
              size="sm"
              variant="outline"
              prefix={<Icon name="lucide/shield" />}
              className="text-blue-500"
            >
              Admin
            </Badge>
          )}
        </DataTableLink>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => <Note>{row.getValue("email")}</Note>,
      enableSorting: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => <Note>{formatDate(row.getValue<Date>("createdAt"))}</Note>,
      size: 0,
    },
    {
      id: "actions",
      cell: ({ row }) => <UserActions user={row.original} className="float-right" />,
      size: 0,
    },
  ]
}
