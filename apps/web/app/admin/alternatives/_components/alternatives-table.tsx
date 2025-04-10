"use client"

import type { Alternative } from "@openalternative/db/client"
import { useQueryStates } from "nuqs"
import { use, useMemo, useState } from "react"
import { AlternativesDeleteDialog } from "~/app/admin/alternatives/_components/alternatives-delete-dialog"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableHeader } from "~/components/data-table/data-table-header"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { DataTableViewOptions } from "~/components/data-table/data-table-view-options"
import { useDataTable } from "~/hooks/use-data-table"
import type { findAlternatives } from "~/server/admin/alternatives/queries"
import { alternativesTableParamsSchema } from "~/server/admin/alternatives/schemas"
import type { DataTableFilterField, DataTableRowAction } from "~/types"
import { getColumns } from "./alternatives-table-columns"
import { AlternativesTableToolbarActions } from "./alternatives-table-toolbar-actions"
import { Icon } from "~/components/common/icon"

type AlternativesTableProps = {
  alternativesPromise: ReturnType<typeof findAlternatives>
}

export function AlternativesTable({ alternativesPromise }: AlternativesTableProps) {
  const { alternatives, alternativesTotal, pageCount } = use(alternativesPromise)
  const [{ perPage, sort }] = useQueryStates(alternativesTableParamsSchema)
  const [rowAction, setRowAction] = useState<DataTableRowAction<Alternative> | null>(null)

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns({ setRowAction }), [])

  // Search filters
  const filterFields: DataTableFilterField<Alternative>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Search by name...",
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
      pagination: { pageIndex: 0, pageSize: perPage },
      sorting: sort,
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
            <Button variant="primary" size="md" prefix={<Icon name="lucide/plus" />} asChild>
              <Link href="/admin/alternatives/new">
                <div className="max-sm:sr-only">New alternative</div>
              </Link>
            </Button>
          }
        >
          <DataTableToolbar table={table} filterFields={filterFields}>
            <AlternativesTableToolbarActions table={table} />
            <DateRangePicker align="end" />
            <DataTableViewOptions table={table} />
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
