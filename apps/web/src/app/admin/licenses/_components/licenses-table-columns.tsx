"use client"

import { formatDate } from "@curiousleaf/utils"
import type { License } from "@openalternative/db/client"
import type { ColumnDef } from "@tanstack/react-table"
import { LicenseActions } from "~/app/admin/licenses/_components/license-actions"
import { DataTableColumnHeader } from "~/components/admin/data-table/data-table-column-header"
import { DataTableLink } from "~/components/admin/data-table/data-table-link"
import { Checkbox } from "~/components/common/checkbox"

export function getColumns(): ColumnDef<License>[] {
  return [
    {
      accessorKey: "name",
      header: ({ table, column }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="my-auto mx-1.5"
          />

          <DataTableColumnHeader column={column} title="Name" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={value => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="my-auto mx-1.5"
          />

          <DataTableLink href={`/admin/licenses/${row.original.slug}`}>
            {row.getValue("name")}
          </DataTableLink>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => (
        <div className="max-w-96 truncate text-muted-foreground">{row.getValue("description")}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{formatDate(row.getValue<Date>("createdAt"))}</span>
      ),
      size: 0,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <LicenseActions license={row.original} row={row} className="float-right -my-0.5" />
      ),
      size: 0,
    },
  ]
}
