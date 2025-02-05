"use client"

import type { License } from "@openalternative/db/client"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { LicensesDeleteDialog } from "~/app/admin/licenses/_components/licenses-delete-dialog"
import { DataTable } from "~/components/admin/data-table/data-table"
import { DataTableHeader } from "~/components/admin/data-table/data-table-header"
import { DataTableToolbar } from "~/components/admin/data-table/data-table-toolbar"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { Button } from "~/components/admin/ui/button"
import { useDataTable } from "~/hooks/use-data-table"
import type { findLicenses } from "~/server/admin/licenses/queries"
import type { DataTableFilterField, DataTableRowAction } from "~/types"
import { getColumns } from "./licenses-table-columns"
import { LicensesTableToolbarActions } from "./licenses-table-toolbar-actions"

type LicensesTableProps = {
  licensesPromise: ReturnType<typeof findLicenses>
}

export function LicensesTable({ licensesPromise }: LicensesTableProps) {
  const { licenses, licensesTotal, pageCount } = React.use(licensesPromise)

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<License> | null>(null)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  // Search filters
  const filterFields: DataTableFilterField<License>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Filter by name...",
    },
  ]

  const { table } = useDataTable({
    data: licenses,
    columns,
    pageCount,
    filterFields,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      sorting: [{ id: "name", desc: false }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  })

  return (
    <>
      <DataTable table={table}>
        <DataTableHeader
          title="Licenses"
          total={licensesTotal}
          callToAction={
            <Button prefix={<PlusIcon />} asChild>
              <Link href="/admin/licenses/new">
                <span className="max-sm:sr-only">New license</span>
              </Link>
            </Button>
          }
        >
          <DataTableToolbar table={table} filterFields={filterFields}>
            <LicensesTableToolbarActions table={table} />
            <DateRangePicker triggerSize="sm" triggerClassName="ml-auto" align="end" />
          </DataTableToolbar>
        </DataTableHeader>
      </DataTable>

      <LicensesDeleteDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        licenses={rowAction?.data ? [rowAction?.data] : []}
        showTrigger={false}
        onSuccess={() => table.toggleAllRowsSelected(false)}
      />
    </>
  )
}
