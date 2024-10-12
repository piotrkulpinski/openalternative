"use client"

import { formatDate } from "@curiousleaf/utils"
import type { Category } from "@openalternative/db"
import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { CategoryActions } from "~/app/(dashboard)/categories/_components/category-actions"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { Checkbox } from "~/components/ui/checkbox"

export function getColumns(): ColumnDef<Category>[] {
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
          href={`/categories/${row.original.id}`}
          className="max-w-36 truncate font-medium text-primary hover:text-foreground"
        >
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: "tagline",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Label" />,
      cell: ({ row }) => (
        <span className="max-w-96 truncate text-muted-foreground">{row.original.label}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ cell }) => (
        <span className="text-muted-foreground">{formatDate(cell.getValue() as Date)}</span>
      ),
      size: 0,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <CategoryActions category={row.original} row={row} className="float-right -my-0.5" />
      ),
      size: 0,
    },
  ]
}
