"use client"

import { formatDate } from "@curiousleaf/utils"
import type { Category } from "@openalternative/db/client"
import type { ColumnDef } from "@tanstack/react-table"
import type { Dispatch, SetStateAction } from "react"
import { CategoryActions } from "~/app/admin/categories/_components/category-actions"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"
import type { DataTableRowAction } from "~/types"

type GetColumnsProps = {
  setRowAction: Dispatch<SetStateAction<DataTableRowAction<Category> | null>>
}

export const getColumns = ({ setRowAction }: GetColumnsProps): ColumnDef<Category>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          ref={input => {
            if (input) {
              input.indeterminate =
                table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
            }
          }}
          onChange={e => table.toggleAllPageRowsSelected(e.target.checked)}
          aria-label="Select all"
          className="translate-y-0.5 ml-1.5"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={e => row.toggleSelected(e.target.checked)}
          aria-label="Select row"
          className="translate-y-0.5 ml-1.5"
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
        <CategoryActions
          category={row.original}
          setRowAction={setRowAction}
          className="float-right -my-1"
        />
      ),
      size: 0,
    },
  ]
}
