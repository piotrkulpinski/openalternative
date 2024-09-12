"use client"

import * as React from "react"
import type { DataTableFilterField } from "~/types"

import type { License } from "@openalternative/db"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableHeader } from "~/components/data-table/data-table-header"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { DataTableViewOptions } from "~/components/data-table/data-table-view-options"
import { DateRangePicker } from "~/components/date-range-picker"
import { Button } from "~/components/ui/button"
import { useDataTable } from "~/hooks/use-data-table"
import type { getLicenses } from "../_lib/queries"
import { getColumns } from "./licenses-table-columns"
import { LicensesTableToolbarActions } from "./licenses-table-toolbar-actions"

interface LicensesTableProps {
  licensesPromise: ReturnType<typeof getLicenses>
}

export function LicensesTable({ licensesPromise }: LicensesTableProps) {
  const { licenses, licensesTotal, pageCount } = React.use(licensesPromise)

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
  const filterFields: DataTableFilterField<License>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Filter by name...",
    },
    // {
    //   label: "Status",
    //   value: "status",
    //   options: licenses.status.enumValues.map(status => ({
    //     label: status[0]?.toUpperCase() + status.slice(1),
    //     value: status,
    //     icon: getStatusIcon(status),
    //     withCount: true,
    //   })),
    // },
    // {
    //   label: "Priority",
    //   value: "priority",
    //   options: licenses.priority.enumValues.map(priority => ({
    //     label: priority[0]?.toUpperCase() + priority.slice(1),
    //     value: priority,
    //     icon: getPriorityIcon(priority),
    //     withCount: true,
    //   })),
    // },
  ]

  const { table } = useDataTable({
    data: licenses,
    columns,
    pageCount,
    /* optional props */
    filterFields,
    initialState: {
      sorting: [{ id: "name", desc: false }],
      columnPinning: { right: ["actions"] },
    },
    // For remembering the previous row selection on page change
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  })

  return (
    <DataTable table={table}>
      <DataTableHeader
        title="Licenses"
        total={licensesTotal}
        callToAction={
          <Button prefix={<PlusIcon />} asChild>
            <Link href="/licenses/new">
              <span className="max-sm:sr-only">New license</span>
            </Link>
          </Button>
        }
      >
        <DataTableToolbar table={table} filterFields={filterFields}>
          <LicensesTableToolbarActions table={table} />
          <DateRangePicker triggerSize="sm" triggerClassName="ml-auto" align="end" />
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  )
}
