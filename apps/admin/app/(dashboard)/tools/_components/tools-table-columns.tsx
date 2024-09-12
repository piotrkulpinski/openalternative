"use client"

import type { Tool } from "@openalternative/db"
import type { ColumnDef } from "@tanstack/react-table"
import { EllipsisIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { siteConfig } from "~/config/site"
import { formatDate } from "~/utils/helpers"
import { DeleteToolsDialog } from "./delete-tools-dialog"

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
        <div className="flex items-center gap-2.5">
          {row.original.faviconUrl && (
            <Image
              src={row.original.faviconUrl}
              alt="Favicon"
              width={16}
              height={16}
              className="size-5 rounded"
            />
          )}

          <Link
            href={`/tools/${row.original.id}`}
            className="max-w-36 truncate font-medium text-primary hover:text-foreground"
          >
            {row.getValue("name")}
          </Link>
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
              {row.original.publishedAt && row.original.publishedAt <= new Date() && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`${siteConfig.url}/${row.original.slug}`} target="_blank">
                    View
                  </Link>
                </Button>
              )}

              <Button variant="outline" size="sm" asChild>
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

                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={row.original.website} target="_blank">
                      Visit website
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href={row.original.repository} target="_blank">
                      Visit repository
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onSelect={() => setShowDeleteToolDialog(true)}
                    className="text-red-500"
                  >
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
