"use client"

import * as React from "react"
import type { DataTableFilterField } from "~/types"

import type { Tool } from "@openalternative/db"
import { CircleDashedIcon, CircleDotDashedIcon, CircleIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableHeader } from "~/components/data-table/data-table-header"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { DataTableViewOptions } from "~/components/data-table/data-table-view-options"
import { DateRangePicker } from "~/components/date-range-picker"
import { Button } from "~/components/ui/button"
import { useDataTable } from "~/hooks/use-data-table"
import type { getTools } from "../_lib/queries"
import { getColumns } from "./tools-table-columns"
import { ToolsTableToolbarActions } from "./tools-table-toolbar-actions"

interface ToolsTableProps {
  toolsPromise: ReturnType<typeof getTools>
}

export function ToolsTable({ toolsPromise }: ToolsTableProps) {
  const { tools, toolsTotal, pageCount } = React.use(toolsPromise)

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
    {
      label: "Status",
      value: "publishedAt",
      options: [
        {
          label: "Published",
          value: "published",
          icon: <CircleIcon className="!text-lime-600" />,
        },
        {
          label: "Scheduled",
          value: "scheduled",
          icon: <CircleDotDashedIcon className="!text-yellow-600" />,
        },
        {
          label: "Draft",
          value: "draft",
          icon: <CircleDashedIcon className="!text-gray-400" />,
        },
      ],
    },
  ]

  const { table } = useDataTable({
    data: tools,
    columns,
    pageCount,
    /* optional props */
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
      columnVisibility: {
        submitterEmail: false,
      },
    },
    // For remembering the previous row selection on page change
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  })

  return (
    <DataTable table={table}>
      <DataTableHeader
        title="Tools"
        total={toolsTotal}
        callToAction={
          <Button prefix={<PlusIcon />} asChild>
            <Link href="/tools/new">
              <span className="max-sm:sr-only">New tool</span>
            </Link>
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
