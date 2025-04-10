import type { Table } from "@tanstack/react-table"

import { Button } from "~/components/common/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { Icon } from "../common/icon"

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  pageSizeOptions?: number[]
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 25, 50],
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-row flex-wrap items-center justify-between gap-4 tabular-nums sm:gap-6 lg:gap-8">
      <div className="grow whitespace-nowrap text-sm text-muted-foreground max-sm:hidden">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <div className="flex items-center space-x-2 max-sm:grow">
        <p className="text-sm font-medium">Rows per page</p>

        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={value => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className="w-auto tabular-nums">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>

          <SelectContent side="top" className="tabular-nums">
            {pageSizeOptions.map(pageSize => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm font-medium max-sm:hidden">
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
      </div>

      <div className="flex items-center gap-2">
        <Button
          aria-label="Go to first page"
          variant="secondary"
          size="md"
          className="max-lg:hidden"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          prefix={<Icon name="lucide/chevrons-left" />}
        />

        <Button
          aria-label="Go to previous page"
          variant="secondary"
          size="md"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          prefix={<Icon name="lucide/chevron-left" />}
        />

        <Button
          aria-label="Go to next page"
          variant="secondary"
          size="md"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          suffix={<Icon name="lucide/chevron-right" />}
        />

        <Button
          aria-label="Go to last page"
          variant="secondary"
          size="md"
          className="max-lg:hidden"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          suffix={<Icon name="lucide/chevrons-right" />}
        />
      </div>
    </div>
  )
}
