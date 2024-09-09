"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { EllipsisIcon } from "lucide-react"
import * as React from "react"

import type { Tool } from "@openalternative/db"
import Link from "next/link"
import { DataTableColumnHeader } from "~/components/data-table/DataTableColumnHeader"
import { Button } from "~/components/ui/Button"
import { Checkbox } from "~/components/ui/Checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu"
import { formatDate } from "~/utils/helpers"
import { DeleteToolsDialog } from "./DeleteToolsDialog"

export function getColumns(): ColumnDef<Tool>[] {
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
          href={`/tools/${row.original.id}`}
          className="max-w-36 truncate font-medium text-primary hover:text-foreground"
        >
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: "tagline",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tagline" />,
      cell: ({ row }) => (
        <span className="max-w-96 truncate text-muted-foreground">{row.getValue("tagline")}</span>
      ),
      enableSorting: false,
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
      cell: function Cell({ row }) {
        const [showDeleteToolDialog, setShowDeleteToolDialog] = React.useState(false)

        return (
          <>
            <DeleteToolsDialog
              open={showDeleteToolDialog}
              onOpenChange={setShowDeleteToolDialog}
              tools={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />

            <div className="flex items-center justify-end gap-1.5 -my-0.5">
              <Button variant="outline" size="sm" className="" asChild>
                <Link href={`/tools/${row.original.id}`}>Edit</Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="Open menu"
                    variant="ghost"
                    size="icon"
                    prefix={<EllipsisIcon />}
                    className="text-muted-foreground data-[state=open]:bg-muted"
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem asChild>
                    <Link href={row.original.website} target="_blank">
                      Visit website
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onSelect={() => setShowDeleteToolDialog(true)}>
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )
      },
      size: 0,
    },
  ]
}
