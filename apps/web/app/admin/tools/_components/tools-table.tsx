"use client"

import { type Tool, ToolStatus } from "@openalternative/db/client"
import { useQueryStates } from "nuqs"
import { use, useMemo, useState } from "react"
import { ToolScheduleDialog } from "~/app/admin/tools/_components/tool-schedule-dialog"
import { ToolsDeleteDialog } from "~/app/admin/tools/_components/tools-delete-dialog"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableHeader } from "~/components/data-table/data-table-header"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { DataTableViewOptions } from "~/components/data-table/data-table-view-options"
import { useDataTable } from "~/hooks/use-data-table"
import type { findTools } from "~/server/admin/tools/queries"
import { toolsTableParamsSchema } from "~/server/admin/tools/schemas"
import type { DataTableFilterField, DataTableRowAction } from "~/types"
import { getColumns } from "./tools-table-columns"
import { ToolsTableToolbarActions } from "./tools-table-toolbar-actions"
import { Icon } from "~/components/common/icon"

type ToolsTableProps = {
  toolsPromise: ReturnType<typeof findTools>
}

export function ToolsTable({ toolsPromise }: ToolsTableProps) {
  const { tools, toolsTotal, pageCount } = use(toolsPromise)
  const [{ perPage, sort }] = useQueryStates(toolsTableParamsSchema)
  const [rowAction, setRowAction] = useState<DataTableRowAction<Tool> | null>(null)

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns({ setRowAction }), [])

  // Search filters
  const filterFields: DataTableFilterField<Tool>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Search by name...",
    },
    {
      id: "status",
      label: "Status",
      options: [
        {
          label: "Published",
          value: ToolStatus.Published,
          icon: <Icon name="lucide/circle" className="!text-lime-500" />,
        },
        {
          label: "Scheduled",
          value: ToolStatus.Scheduled,
          icon: <Icon name="lucide/circle-dot-dashed" className="!text-yellow-500" />,
        },
        {
          label: "Draft",
          value: ToolStatus.Draft,
          icon: <Icon name="lucide/circle-dashed" className="!text-gray-500" />,
        },
      ],
    },
  ]

  const { table } = useDataTable({
    data: tools,
    columns,
    pageCount,
    filterFields,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: perPage },
      sorting: sort,
      columnVisibility: { status: false, submitterEmail: false },
      columnPinning: { right: ["actions"] },
    },
    getRowId: originalRow => originalRow.id,
  })

  return (
    <>
      <DataTable table={table}>
        <DataTableHeader
          title="Tools"
          total={toolsTotal}
          callToAction={
            <Button variant="primary" size="md" prefix={<Icon name="lucide/plus" />} asChild>
              <Link href="/admin/tools/new">
                <div className="max-sm:sr-only">New tool</div>
              </Link>
            </Button>
          }
        >
          <DataTableToolbar table={table} filterFields={filterFields}>
            <ToolsTableToolbarActions table={table} />
            <DateRangePicker align="end" />
            <DataTableViewOptions table={table} />
          </DataTableToolbar>
        </DataTableHeader>
      </DataTable>

      <ToolScheduleDialog
        open={rowAction?.type === "schedule"}
        onOpenChange={() => setRowAction(null)}
        tool={rowAction?.data}
        showTrigger={false}
      />

      <ToolsDeleteDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        tools={rowAction?.data ? [rowAction?.data] : []}
        showTrigger={false}
        onSuccess={() => table.toggleAllRowsSelected(false)}
      />
    </>
  )
}
