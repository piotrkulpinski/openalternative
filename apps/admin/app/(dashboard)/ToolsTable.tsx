"use client"

import type { Tool } from "@openalternative/db"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { format } from "timeago.js"
import { Badge } from "~/components/ui/Badge"
import { Button } from "~/components/ui/Button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/Table"
import { cx } from "~/utils/cva"

type ToolsTableProps = {
  tools: Tool[]
  offset: number
  totalTools: number
  perPage: number
}

export function ToolsTable({ tools, offset, totalTools, perPage }: ToolsTableProps) {
  const columnHelper = createColumnHelper<Tool>()

  const columns = [
    columnHelper.accessor("faviconUrl", {
      header: () => <span className="sr-only">Favicon</span>,
      cell: info => (
        <>
          {info.renderValue() !== null && (
            <Image
              src={info.renderValue()}
              alt="Product image"
              height="64"
              width="64"
              className="size-5 ml-2 aspect-square rounded object-cover"
            />
          )}
        </>
      ),
      size: 300,
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: info => <strong>{info.getValue()}</strong>,
    }),
    columnHelper.accessor("publishedAt", {
      header: () => "Status",
      cell: info => (
        <Badge variant="outline" className={cx(info.getValue() && "bg-green-50")}>
          {info.getValue() ? "Published" : "Draft"}
        </Badge>
      ),
    }),
    columnHelper.accessor("tagline", {
      header: () => "Tagline",
      cell: info => <span className="text-muted-foreground">{info.getValue()}</span>,
    }),
    columnHelper.accessor("score", {
      header: () => "Score",
      cell: info => <>{info.getValue()}</>,
    }),
    columnHelper.accessor("publishedAt", {
      header: () => "Created at",
      cell: info => (
        <span className="text-muted-foreground">
          {info.getValue() ? format(info.getValue() ?? "") : "-"}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: () => <></>,
    }),
  ]

  const table = useReactTable({
    data: tools,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  })

  return (
    <>
      <div className="overflow-clip rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {/* {tools.map(tool => (
              <ToolRow key={tool.id} tool={tool} />
            ))} */}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center w-full justify-between">
        <div className="text-xs text-muted-foreground">
          Page{" "}
          <strong className="text-foreground">{table.getState().pagination.pageIndex + 1}</strong>{" "}
          of <strong className="text-foreground">{table.getPageCount()}</strong>
        </div>
        <div className="flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="mr-2 size-4" />
            Prev
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
