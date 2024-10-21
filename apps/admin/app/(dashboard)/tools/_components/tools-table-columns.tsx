"use client"

import { formatDate } from "@curiousleaf/utils"
import type { Tool } from "@openalternative/db"
import type { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { ToolActions } from "~/app/(dashboard)/tools/_components/tool-actions"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"
import { Checkbox } from "~/components/ui/checkbox"

export function getColumns(): ColumnDef<Tool>[] {
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
            className="block my-auto mx-1.5"
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
            className="block my-auto mx-1.5"
          />

          <DataTableLink href={`/tools/${row.original.id}`} className="flex items-center gap-2">
            {row.original.faviconUrl && (
              <Image
                src={row.original.faviconUrl}
                alt="Favicon"
                width={16}
                height={16}
                className="size-4 rounded"
              />
            )}

            {row.getValue("name")}
          </DataTableLink>
        </div>
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
      id: "actions",
      cell: ({ row }) => (
        <ToolActions tool={row.original} row={row} className="float-right -my-0.5" />
      ),
      size: 0,
    },
  ]
}
