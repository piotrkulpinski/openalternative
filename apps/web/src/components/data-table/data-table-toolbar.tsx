"use client"

import type { Table } from "@tanstack/react-table"
import { XIcon } from "lucide-react"
import * as React from "react"
import type { ComponentProps } from "react"
import { Button } from "~/components/common/button"
import { Input } from "~/components/common/input"
import { Stack } from "~/components/common/stack"
import { DataTableFacetedFilter } from "~/components/data-table/data-table-faceted-filter"
import type { DataTableFilterField } from "~/types"
import { cx } from "~/utils/cva"

type DataTableToolbarProps<TData> = ComponentProps<"div"> & {
  table: Table<TData>
  filterFields?: DataTableFilterField<TData>[]
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter(field => !field.options),
      filterableColumns: filterFields.filter(field => field.options),
    }
  }, [filterFields])

  return (
    <Stack
      size="sm"
      className={cx("justify-between w-full py-1 -my-1 overflow-auto", className)}
      {...props}
    >
      <Stack size="sm">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            column =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <Input
                  key={String(column.id)}
                  className="w-40 lg:w-60"
                  placeholder={column.placeholder}
                  value={(table.getColumn(String(column.id))?.getFilterValue() as string) ?? ""}
                  onChange={e => table.getColumn(String(column.id))?.setFilterValue(e.target.value)}
                />
              ),
          )}

        {filterableColumns.length > 0 &&
          filterableColumns.map(
            column =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <DataTableFacetedFilter
                  key={String(column.id)}
                  column={table.getColumn(column.id ? String(column.id) : "")}
                  title={column.label}
                  options={column.options ?? []}
                />
              ),
          )}

        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            size="md"
            onClick={() => table.resetColumnFilters()}
            suffix={<XIcon />}
          >
            Reset
          </Button>
        )}
      </Stack>

      <Stack size="sm">{children}</Stack>
    </Stack>
  )
}
