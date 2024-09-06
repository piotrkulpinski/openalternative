"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { EllipsisIcon } from "lucide-react"
import Image from "next/image"
import * as React from "react"

import type { Tool } from "@openalternative/db"
import { DataTableColumnHeader } from "~/components/data-table/DataTableColumnHeader"
import { Button } from "~/components/ui/Button"
import { Checkbox } from "~/components/ui/Checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu"
import { formatDate } from "~/utils/helpers"
import { DeleteToolsDialog } from "./DeleteToolsDialog"
import { UpdateToolSheet } from "./UpdateToolSheet"

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
        <div className="flex items-center gap-3">
          {row.original.faviconUrl && (
            <Image
              src={row.original.faviconUrl}
              alt="Tool favicon"
              height="64"
              width="64"
              className="h-6 w-auto aspect-square rounded object-cover"
            />
          )}
          <div className="max-w-36 truncate font-medium">{row.getValue("name")}</div>
        </div>
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
        const [isUpdatePending, startUpdateTransition] = React.useTransition()
        const [showUpdateToolSheet, setShowUpdateToolSheet] = React.useState(false)
        const [showDeleteToolDialog, setShowDeleteToolDialog] = React.useState(false)

        return (
          <>
            <UpdateToolSheet
              open={showUpdateToolSheet}
              onOpenChange={setShowUpdateToolSheet}
              tool={row.original}
            />

            <DeleteToolsDialog
              open={showDeleteToolDialog}
              onOpenChange={setShowDeleteToolDialog}
              tools={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="ml-auto mr-1 -my-0.5"
                onClick={() => setShowUpdateToolSheet(true)}
              >
                Edit
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
                  {/*<DropdownMenuSub>
                  <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.label}
                      onValueChange={value => {
                        startUpdateTransition(() => {
                          toast.promise(
                            updateTool(row.original.id, {
                              label: value as Tool["label"],
                            }),
                            {
                              loading: "Updating...",
                              success: "Label updated",
                              error: err => getErrorMessage(err),
                            },
                          )
                        })
                      }}
                    >
                      {tools.label.enumValues.map(label => (
                        <DropdownMenuRadioItem
                          key={label}
                          value={label}
                          className="capitalize"
                          disabled={isUpdatePending}
                        >
                          {label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub> */}
                  {/* <DropdownMenuSeparator /> */}
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
