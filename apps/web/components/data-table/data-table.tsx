import { type Table as TanstackTable, flexRender } from "@tanstack/react-table"
import type * as React from "react"
import type { ComponentProps } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/common/table"
import { DataTablePagination } from "~/components/data-table/data-table-pagination"
import { getColumnPinningStyle } from "~/lib/data-table"
import { cx } from "~/utils/cva"

type DataTableProps<TData> = ComponentProps<"div"> & {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>

  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBar={<TasksTableFloatingBar table={table} />}
   */
  floatingBar?: React.ReactNode | null

  /**
   * The empty state to render when the table has no data.
   * @default null
   * @type React.ReactNode | null
   * @example emptyState={<div>No data</div>}
   */
  emptyState?: React.ReactNode | null
}

export function DataTable<TData>({
  table,
  floatingBar = null,
  emptyState = "No results.",
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  return (
    <>
      {children}

      <div className={cx("overflow-hidden rounded-md border", className)} {...props}>
        <Table>
          {!!table.getRowModel().rows?.length && (
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={getColumnPinningStyle({ column: header.column })}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
          )}

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      style={getColumnPinningStyle({ column: cell.column })}
                      className={cx(
                        cell.column.getIsPinned() ? "sticky z-10 max-md:relative!" : "relative",
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow aria-disabled>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  {emptyState}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {table.getFilteredSelectedRowModel().rows.length > 0 && floatingBar}
      </div>
    </>
  )
}
