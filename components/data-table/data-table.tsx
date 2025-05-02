import { type Table as TanstackTable, flexRender } from "@tanstack/react-table"
import type { CSSProperties, ComponentProps, ReactNode } from "react"
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

type DataTableProps<TData> = ComponentProps<typeof Table> & {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>

  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   * @type ReactNode | null
   * @example floatingBar={<TasksTableFloatingBar table={table} />}
   */
  floatingBar?: ReactNode | null

  /**
   * The empty state to render when the table has no data.
   * @default null
   * @type ReactNode | null
   * @example emptyState={<div>No data</div>}
   */
  emptyState?: ReactNode | null
}

export function DataTable<TData>({
  table,
  floatingBar = null,
  emptyState = "No results.",
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  const visibleColumns = table.getVisibleLeafColumns()

  // Calculate grid columns based on the visible columns and their sizes
  const gridColumns = visibleColumns.map(column => {
    // If column has a size, use 'minmax'
    if (column.getSize() > 0) return `minmax(${column.getSize()}px, 1fr)`
    // For other columns, use 'auto'
    return "auto"
  })

  return (
    <>
      {children}

      <Table
        className={cx("rounded-md border", className)}
        style={{ "--table-columns": gridColumns.join(" ") } as CSSProperties}
        {...props}
      >
        {!!table.getRowModel().rows?.length && (
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} style={getColumnPinningStyle(header)}>
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
                    style={getColumnPinningStyle({ column: cell.column, withBorder: true })}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="h-24" aria-disabled>
              <TableCell className="col-span-full text-center">{emptyState}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {table.getFilteredSelectedRowModel().rows.length > 0 && floatingBar}
      </div>
    </>
  )
}
