"use client"

import { formatDate } from "@curiousleaf/utils"
import type { User } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import type { ComponentProps } from "react"
import { UserActions } from "~/app/admin/users/_components/user-actions"
import { RowCheckbox } from "~/components/admin/row-checkbox"
import { Badge } from "~/components/common/badge"
import { Note } from "~/components/common/note"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"

export const getColumns = (): ColumnDef<User>[] => {
  const roleBadges: Record<"admin" | "user", ComponentProps<typeof Badge>> = {
    admin: {
      variant: "info",
      className: "capitalize",
    },
    user: {
      variant: "outline",
      className: "capitalize",
    },
  }

  return [
    {
      id: "select",
      enableSorting: false,
      enableHiding: false,
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
    },
    {
      accessorKey: "name",
      enableHiding: false,
      size: 160,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <DataTableLink
          href={`/admin/users/${row.original.id}`}
          title={row.original.name || row.original.email}
        />
      ),
    },
    {
      accessorKey: "email",
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => <Note>{row.getValue("email")}</Note>,
    },
    {
      accessorKey: "role",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => {
        const role = row.getValue<"admin" | "user">("role")
        const isBanned = row.original.banned

        if (isBanned) {
          return (
            <Badge size="sm" variant="outline" className="text-red-500">
              Banned
            </Badge>
          )
        }

        return <Badge {...roleBadges[role]}>{role}</Badge>
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => <Note>{formatDate(row.getValue<Date>("createdAt"))}</Note>,
    },
    {
      id: "actions",
      cell: ({ row }) => <UserActions user={row.original} className="float-right" />,
    },
  ]
}
