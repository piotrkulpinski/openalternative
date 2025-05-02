"use client"

import { type Report, ReportType } from "@prisma/client"
import { useQueryStates } from "nuqs"
import { use, useMemo } from "react"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableHeader } from "~/components/data-table/data-table-header"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { DataTableViewOptions } from "~/components/data-table/data-table-view-options"
import { useDataTable } from "~/hooks/use-data-table"
import type { findReports } from "~/server/admin/reports/queries"
import { reportsTableParamsSchema } from "~/server/admin/reports/schema"
import type { DataTableFilterField } from "~/types"
import { getColumns } from "./reports-table-columns"
import { ReportsTableToolbarActions } from "./reports-table-toolbar-actions"

type ReportsTableProps = {
  reportsPromise: ReturnType<typeof findReports>
}

export function ReportsTable({ reportsPromise }: ReportsTableProps) {
  const { reports, reportsTotal, pageCount } = use(reportsPromise)
  const [{ perPage, sort }] = useQueryStates(reportsTableParamsSchema)

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns(), [])

  // Search filters
  const filterFields: DataTableFilterField<Report>[] = [
    {
      id: "message",
      label: "Message",
      placeholder: "Search by message...",
    },
    {
      id: "type",
      label: "Type",
      options: Object.values(ReportType).map(type => ({
        label: type,
        value: type,
      })),
    },
  ]

  const { table } = useDataTable({
    data: reports,
    columns,
    pageCount,
    filterFields,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: perPage },
      sorting: sort,
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  })

  return (
    <>
      <DataTable table={table}>
        <DataTableHeader title="Reports" total={reportsTotal}>
          <DataTableToolbar table={table} filterFields={filterFields}>
            <ReportsTableToolbarActions table={table} />
            <DateRangePicker align="end" />
            <DataTableViewOptions table={table} />
          </DataTableToolbar>
        </DataTableHeader>
      </DataTable>
    </>
  )
}
