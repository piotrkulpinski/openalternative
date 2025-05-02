"use client"

import { formatDate } from "@curiousleaf/utils"
import type { Report, Tool, User } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { ReportActions } from "~/app/admin/reports/_components/report-actions"
import { RowCheckbox } from "~/components/admin/row-checkbox"
import { Badge } from "~/components/common/badge"
import { Note } from "~/components/common/note"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"

export const getColumns = (): ColumnDef<Report>[] => {
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
      accessorKey: "id",
      enableSorting: false,
      enableHiding: false,
      size: 160,
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => (
        <DataTableLink
          href={`/admin/reports/${row.original.id}`}
          title={`#${row.original.id.slice(-6).toUpperCase()}`}
        />
      ),
    },
    {
      accessorKey: "message",
      enableSorting: false,
      size: 320,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Message" />,
      cell: ({ row }) => <Note className="truncate">{row.getValue("message")}</Note>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Reported At" />,
      cell: ({ row }) => <Note>{formatDate(row.getValue<Date>("createdAt"))}</Note>,
    },
    {
      accessorKey: "type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
    },
    {
      accessorKey: "user",
      header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
      cell: ({ row }) => {
        const user = row.getValue<Pick<User, "id" | "name">>("user")

        return (
          <DataTableLink href={`/admin/users/${user?.id}`} title={user?.name} isOverlay={false} />
        )
      },
    },
    {
      accessorKey: "tool",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tool" />,
      cell: ({ row }) => {
        const tool = row.getValue<Pick<Tool, "slug" | "name">>("tool")

        return (
          <DataTableLink href={`/admin/tools/${tool?.slug}`} title={tool?.name} isOverlay={false} />
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <ReportActions report={row.original} className="float-right" />,
    },
  ]
}
