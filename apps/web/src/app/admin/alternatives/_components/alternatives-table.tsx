"use client"

import type { Alternative } from "@openalternative/db/client"
import { PlusIcon } from "lucide-react"
import * as React from "react"
import { AlternativesDeleteDialog } from "~/app/admin/alternatives/_components/alternatives-delete-dialog"
import { DataTable } from "~/components/admin/data-table/data-table"
import { DataTableHeader } from "~/components/admin/data-table/data-table-header"
import { DataTableToolbar } from "~/components/admin/data-table/data-table-toolbar"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { useDataTable } from "~/hooks/use-data-table"
import type { findAlternatives } from "~/server/admin/alternatives/queries"
import type { DataTableFilterField, DataTableRowAction } from "~/types"
import { getColumns } from "./alternatives-table-columns"
import { AlternativesTableToolbarActions } from "./alternatives-table-toolbar-actions"

type AlternativesTableProps = {
  alternativesPromise: ReturnType<typeof findAlternatives>
}

export function AlternativesTable({ alternativesPromise }: AlternativesTableProps) {
  const { alternatives, alternativesTotal, pageCount } = React.use(alternativesPromise)

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Alternative> | null>(null)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  // Search filters
  const filterFields: DataTableFilterField<Alternative>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Filter by name...",
    },
  ]

  const { table } = useDataTable({
    data: alternatives,
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
          title="Alternatives"
          total={alternativesTotal}
          callToAction={
            <Button variant="fancy" size="md" prefix={<PlusIcon />} asChild>
              <Link href="/admin/alternatives/new">
                <div className="max-sm:sr-only">New alternative</div>
              </Link>
            </Button>
          }
        >
          <DataTableToolbar table={table} filterFields={filterFields}>
            <AlternativesTableToolbarActions table={table} />
            <DateRangePicker align="end" />
          </DataTableToolbar>
        </DataTableHeader>
      </DataTable>

      <AlternativesDeleteDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        alternatives={rowAction?.data ? [rowAction?.data] : []}
        showTrigger={false}
        onSuccess={() => table.toggleAllRowsSelected(false)}
      />
    </>
  )
}
