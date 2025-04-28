"use client"

import { formatDate } from "@curiousleaf/utils"
import type { Alternative } from "@openalternative/db/client"
import type { ColumnDef } from "@tanstack/react-table"
import { AlternativeActions } from "~/app/admin/alternatives/_components/alternative-actions"
import { RowCheckbox } from "~/components/admin/row-checkbox"
import { Note } from "~/components/common/note"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"

export const getColumns = (): ColumnDef<Alternative>[] => {
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
      cell: ({ row }) => {
        const { name, slug, faviconUrl } = row.original

        return (
          <DataTableLink href={`/admin/alternatives/${slug}`} image={faviconUrl} title={name} />
        )
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => <Note className="max-w-96 truncate">{row.getValue("description")}</Note>,
      enableSorting: false,
    },
    {
      accessorKey: "pageviews",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Pageviews" />,
      cell: ({ row }) => <Note>{row.getValue("pageviews")?.toLocaleString()}</Note>,
      size: 0,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => <Note>{formatDate(row.getValue<Date>("createdAt"))}</Note>,
      size: 0,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <AlternativeActions alternative={row.original} className="float-right -my-1" />
      ),
      size: 0,
    },
  ]
}
