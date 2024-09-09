"use client"

import * as React from "react"
import type { DataTableFilterField } from "~/types"

import type { Tool } from "@openalternative/db"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { DateRangePicker } from "~/components/DateRangePicker"
import { DataTable } from "~/components/data-table/DataTable"
import { DataTableHeader } from "~/components/data-table/DataTableHeader"
import { DataTableToolbar } from "~/components/data-table/DataTableToolbar"
import { DataTableViewOptions } from "~/components/data-table/DataTableViewOptions"
import { Button } from "~/components/ui/Button"
import { useDataTable } from "~/hooks/use-data-table"
import type { getTools } from "../lib/queries"
import { getColumns } from "./ToolsTableColumns"
import { ToolsTableToolbarActions } from "./ToolsTableToolbarActions"

interface ToolsTableProps {
  toolsPromise: ReturnType<typeof getTools>
}

export function ToolsTable({ toolsPromise }: ToolsTableProps) {
  const { data, pageCount } = React.use(toolsPromise)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), [])

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<Tool>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Filter by name...",
    },
    // {
    //   label: "Status",
    //   value: "status",
    //   options: tools.status.enumValues.map(status => ({
    //     label: status[0]?.toUpperCase() + status.slice(1),
    //     value: status,
    //     icon: getStatusIcon(status),
    //     withCount: true,
    //   })),
    // },
    // {
    //   label: "Priority",
    //   value: "priority",
    //   options: tools.priority.enumValues.map(priority => ({
    //     label: priority[0]?.toUpperCase() + priority.slice(1),
    //     value: priority,
    //     icon: getPriorityIcon(priority),
    //     withCount: true,
    //   })),
    // },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    /* optional props */
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    // For remembering the previous row selection on page change
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  })

  return (
    <DataTable table={table}>
      <DataTableHeader
        title="Tools"
        callToAction={
          <Button size="sm" prefix={<PlusIcon />} asChild>
            <Link href="/tools/new">New tool</Link>
          </Button>
        }
      >
        <DataTableToolbar table={table} filterFields={filterFields}>
          <ToolsTableToolbarActions table={table} />
          <DateRangePicker triggerSize="sm" triggerClassName="ml-auto" align="end" />
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  )
}
