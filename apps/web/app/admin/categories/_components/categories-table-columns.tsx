"use client"

import { formatDate } from "@curiousleaf/utils"
import type { Category } from "@openalternative/db/client"
import type { ColumnDef } from "@tanstack/react-table"
import { CategoryActions } from "~/app/admin/categories/_components/category-actions"
import { RowCheckbox } from "~/components/admin/row-checkbox"
import { Note } from "~/components/common/note"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"

export const getColumns = (): ColumnDef<Category>[] => {
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
        <DataTableLink href={`/admin/categories/${row.original.slug}`} title={row.original.name} />
      ),
    },
    {
      accessorKey: "tagline",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Label" />,
      cell: ({ row }) => <Note className="max-w-96 truncate">{row.original.label}</Note>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ cell }) => <Note>{formatDate(cell.getValue() as Date)}</Note>,
      size: 0,
    },
    {
      id: "actions",
      cell: ({ row }) => <CategoryActions category={row.original} className="float-right" />,
      size: 0,
    },
  ]
}
