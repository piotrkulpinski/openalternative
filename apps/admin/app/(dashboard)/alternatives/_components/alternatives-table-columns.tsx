"use client"

import type { Alternative } from "@openalternative/db"
import type { ColumnDef } from "@tanstack/react-table"
import { EllipsisIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { toast } from "sonner"
import { reuploadAlternativeAssets } from "~/actions/assets"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { siteConfig } from "~/config/site"
import { formatDate } from "~/utils/helpers"
import { DeleteAlternativesDialog } from "./delete-alternatives-dialog"

export function getColumns(): ColumnDef<Alternative>[] {
  const handleReuploadAssets = async (tool: Alternative) => {
    await reuploadAlternativeAssets(tool)
    toast.success("Alternative assets reuploaded")
  }

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
            href={`/alternatives/${row.original.id}`}
            className="max-w-36 truncate font-medium text-primary hover:text-foreground"
          >
            {row.getValue("name")}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => (
        <div className="max-w-96 truncate text-muted-foreground">{row.getValue("description")}</div>
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
        const [showDeleteAlternativeDialog, setShowDeleteAlternativeDialog] = React.useState(false)

        return (
          <>
            <DeleteAlternativesDialog
              open={showDeleteAlternativeDialog}
              onOpenChange={setShowDeleteAlternativeDialog}
              alternatives={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />

            <div className="flex items-center justify-end gap-1.5 -my-0.5">
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
                    <Link href={`/alternatives/${row.original.id}`}>Edit</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href={`${siteConfig.url}/alternatives/${row.original.slug}`}
                      target="_blank"
                    >
                      View
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem onSelect={() => handleReuploadAssets(row.original)}>
                    Reupload Assets
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href={row.original.website} target="_blank">
                      Visit website
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onSelect={() => setShowDeleteAlternativeDialog(true)}
                    className="text-red-500"
                  >
                    Delete
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
