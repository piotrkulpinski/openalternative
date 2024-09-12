"use client"

import type { Category } from "@openalternative/db"
import type { ColumnDef } from "@tanstack/react-table"
import { EllipsisIcon } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { siteConfig } from "~/config/site"
import { formatDate } from "~/utils/helpers"
import { DeleteCategoriesDialog } from "./delete-categories-dialog"

export function getColumns(): ColumnDef<Category>[] {
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
          href={`/categories/${row.original.id}`}
          className="max-w-36 truncate font-medium text-primary hover:text-foreground"
        >
          {row.getValue("name")}
        </Link>
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
      cell: function Cell({ row }) {
        const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = React.useState(false)

        return (
          <>
            <DeleteCategoriesDialog
              open={showDeleteCategoryDialog}
              onOpenChange={setShowDeleteCategoryDialog}
              categories={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />

            <div className="flex items-center justify-end gap-1.5 -my-0.5">
              <Button variant="outline" size="sm" asChild>
                <Link href={`${siteConfig.url}/categories/${row.original.slug}`} target="_blank">
                  View
                </Link>
              </Button>

              <Button variant="outline" size="sm" asChild>
                <Link href={`/categories/${row.original.id}`}>Edit</Link>
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
                  <DropdownMenuItem
                    onSelect={() => setShowDeleteCategoryDialog(true)}
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
