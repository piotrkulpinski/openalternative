"use client"

import { type Tool, ToolStatus } from "@openalternative/db/client"
import { CircleDashedIcon, CircleDotDashedIcon, CircleIcon, PlusIcon } from "lucide-react"
import { use, useMemo, useState } from "react"
import { ToolScheduleDialog } from "~/app/admin/tools/_components/tool-schedule-dialog"
import { ToolsDeleteDialog } from "~/app/admin/tools/_components/tools-delete-dialog"
import { DataTable } from "~/components/admin/data-table/data-table"
import { DataTableHeader } from "~/components/admin/data-table/data-table-header"
import { DataTableToolbar } from "~/components/admin/data-table/data-table-toolbar"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { useDataTable } from "~/hooks/use-data-table"
import type { findTools } from "~/server/admin/tools/queries"
import type { DataTableFilterField, DataTableRowAction } from "~/types"
import { getColumns } from "./tools-table-columns"
import { ToolsTableToolbarActions } from "./tools-table-toolbar-actions"

type ToolsTableProps = {
  toolsPromise: ReturnType<typeof findTools>
}

export function ToolsTable({ toolsPromise }: ToolsTableProps) {
  const { tools, toolsTotal, pageCount } = use(toolsPromise)

  const [rowAction, setRowAction] = useState<DataTableRowAction<Tool> | null>(null)

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns({ setRowAction }), [])

  // Search filters
  const filterFields: DataTableFilterField<Tool>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Filter by name...",
    },
    {
      id: "status",
      label: "Status",
      options: [
        {
          label: "Published",
          value: ToolStatus.Published,
          icon: <CircleIcon className="!text-lime-500" />,
        },
        {
          label: "Scheduled",
          value: ToolStatus.Scheduled,
          icon: <CircleDotDashedIcon className="!text-yellow-500" />,
        },
        {
          label: "Draft",
          value: ToolStatus.Draft,
          icon: <CircleDashedIcon className="!text-gray-500" />,
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
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
      columnVisibility: {
        status: false,
        submitterEmail: false,
      },
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
            <Button variant="fancy" size="md" prefix={<PlusIcon />} asChild>
              <Link href="/admin/tools/new">
                <span className="max-sm:sr-only">New tool</span>
              </Link>
            </Button>
          }
        >
          <DataTableToolbar table={table} filterFields={filterFields}>
            <ToolsTableToolbarActions table={table} />
            <DateRangePicker align="end" />
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
