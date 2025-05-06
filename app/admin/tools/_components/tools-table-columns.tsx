"use client"

import { formatDate } from "@curiousleaf/utils"
import { type Tool, ToolStatus } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import type { ComponentProps } from "react"
import { ToolActions } from "~/app/admin/tools/_components/tool-actions"
import { RowCheckbox } from "~/components/admin/row-checkbox"
import { Badge } from "~/components/common/badge"
import { Note } from "~/components/common/note"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"
import { VerifiedBadge } from "~/components/web/verified-badge"

export const getColumns = (): ColumnDef<Tool>[] => {
  const statusBadges: Record<ToolStatus, ComponentProps<typeof Badge>> = {
    [ToolStatus.Draft]: {
      variant: "soft",
    },

    [ToolStatus.Scheduled]: {
      variant: "info",
    },

    [ToolStatus.Published]: {
      variant: "success",
    },
  }

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
      accessorKey: "name",
      enableHiding: false,
      size: 160,
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
      enableSorting: false,
      size: 320,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tagline" />,
      cell: ({ row }) => <Note className="truncate">{row.getValue("tagline")}</Note>,
    },
    {
      accessorKey: "submitterEmail",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Submitter" />,
      cell: ({ row }) => <Note className="text-sm">{row.getValue("submitterEmail")}</Note>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge {...statusBadges[row.original.status]}>{row.original.status}</Badge>
      ),
    },
    {
      accessorKey: "pageviews",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Pageviews" />,
      cell: ({ row }) => <Note>{row.getValue("pageviews")?.toLocaleString()}</Note>,
    },
    {
      accessorKey: "publishedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Published At" />,
      cell: ({ row }) =>
        row.original.publishedAt ? (
          <Note>{formatDate(row.getValue<Date>("publishedAt"))}</Note>
        ) : (
          <Note>—</Note>
        ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => <Note>{formatDate(row.getValue<Date>("createdAt"))}</Note>,
    },
    {
      id: "actions",
      cell: ({ row }) => <ToolActions tool={row.original} className="float-right" />,
    },
  ]
}
