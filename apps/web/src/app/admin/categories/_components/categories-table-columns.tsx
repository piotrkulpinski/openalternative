"use client"

import { formatDate } from "@curiousleaf/utils"
import type { Category } from "@openalternative/db/client"
import type { ColumnDef } from "@tanstack/react-table"
import { CategoryActions } from "~/app/admin/categories/_components/category-actions"
import { DataTableColumnHeader } from "~/components/admin/data-table/data-table-column-header"
import { DataTableLink } from "~/components/admin/data-table/data-table-link"
import { Checkbox } from "~/components/common/checkbox"

export function getColumns(): ColumnDef<Category>[] {
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

          <DataTableLink href={`/admin/categories/${row.original.slug}`}>
            {row.getValue("name")}
          </DataTableLink>
        </div>
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
