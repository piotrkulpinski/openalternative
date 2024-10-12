"use client"

import { formatDate } from "@curiousleaf/utils"
import type { License } from "@openalternative/db"
import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { LicenseActions } from "~/app/(dashboard)/licenses/_components/license-actions"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { Checkbox } from "~/components/ui/checkbox"

export function getColumns(): ColumnDef<License>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="block my-auto mx-1.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="block my-auto mx-1.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 0,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <Link
          href={`/licenses/${row.original.id}`}
          className="max-w-36 truncate font-medium text-primary hover:text-foreground"
        >
          {row.getValue("name")}
        </Link>
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
