"use client"

import { formatDate } from "@curiousleaf/utils"
import type { Tool } from "@openalternative/db/client"
import type { ColumnDef } from "@tanstack/react-table"
import { ToolActions } from "~/app/admin/tools/_components/tool-actions"
import { DataTableColumnHeader } from "~/components/admin/data-table/data-table-column-header"
import { DataTableLink } from "~/components/admin/data-table/data-table-link"
import { DataTableThumbnail } from "~/components/admin/data-table/data-table-thumbnail"
import type { DataTableRowAction } from "~/types"

type GetColumnsProps = {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Tool> | null>>
}

export const getColumns = ({ setRowAction }: GetColumnsProps): ColumnDef<Tool>[] => {
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
        <DataTableLink href={`/admin/tools/${row.original.slug}`}>
          {row.original.faviconUrl && <DataTableThumbnail src={row.original.faviconUrl} />}
          {row.getValue("name")}
        </DataTableLink>
      ),
    },
    {
      accessorKey: "tagline",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tagline" />,
      cell: ({ row }) => (
        <div className="max-w-96 truncate text-muted-foreground">{row.getValue("tagline")}</div>
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
      accessorKey: "publishedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Published At" />,
      cell: ({ row }) =>
        row.original.publishedAt ? (
          <span className="text-muted-foreground">
            {formatDate(row.getValue<Date>("publishedAt"))}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
      size: 0,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("status")}</span>,
      size: 0,
    },
    {
      accessorKey: "submitterEmail",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Submitter" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.getValue("submitterEmail")}</span>
      ),
      size: 0,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ToolActions
          tool={row.original}
          setRowAction={setRowAction}
          className="float-right -my-1"
        />
      ),
      size: 0,
    },
  ]
}
