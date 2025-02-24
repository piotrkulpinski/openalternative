"use client"

import { type Report, ReportType } from "@openalternative/db/client"
import * as React from "react"
import { ReportsDeleteDialog } from "~/app/admin/reports/_components/reports-delete-dialog"
import { DataTable } from "~/components/admin/data-table/data-table"
import { DataTableHeader } from "~/components/admin/data-table/data-table-header"
import { DataTableToolbar } from "~/components/admin/data-table/data-table-toolbar"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { useDataTable } from "~/hooks/use-data-table"
import type { findReports } from "~/server/admin/reports/queries"
import type { DataTableFilterField, DataTableRowAction } from "~/types"
import { getColumns } from "./reports-table-columns"
import { ReportsTableToolbarActions } from "./reports-table-toolbar-actions"

type ReportsTableProps = {
  reportsPromise: ReturnType<typeof findReports>
}

export function ReportsTable({ reportsPromise }: ReportsTableProps) {
  const { reports, reportsTotal, pageCount } = React.use(reportsPromise)

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Report> | null>(null)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  // Search filters
  const filterFields: DataTableFilterField<Report>[] = [
    {
      id: "message",
      label: "Message",
      placeholder: "Filter by message...",
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
      sorting: [{ id: "createdAt", desc: false }],
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
          </DataTableToolbar>
        </DataTableHeader>
      </DataTable>

      <ReportsDeleteDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        reports={rowAction?.data ? [rowAction?.data] : []}
        showTrigger={false}
        onSuccess={() => table.toggleAllRowsSelected(false)}
      />
    </>
  )
}
