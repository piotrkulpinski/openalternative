"use client"

import { formatDate } from "@curiousleaf/utils"
import type { Tool } from "@openalternative/db/client"
import type { ColumnDef } from "@tanstack/react-table"
import type { Dispatch, SetStateAction } from "react"
import { ToolActions } from "~/app/admin/tools/_components/tool-actions"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"
import { VerifiedBadge } from "~/components/web/verified-badge"
import type { DataTableRowAction } from "~/types"

type GetColumnsProps = {
  setRowAction: Dispatch<SetStateAction<DataTableRowAction<Tool> | null>>
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
      cell: ({ row }) => {
        const { name, slug, faviconUrl, ownerId } = row.original

        return (
          <DataTableLink href={`/admin/tools/${slug}`} image={faviconUrl} title={name}>
            {ownerId && <VerifiedBadge size="sm" />}
          </DataTableLink>
        )
      },
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
      accessorKey: "pageviews",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Pageviews" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.getValue("pageviews")?.toLocaleString()}</span>
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
