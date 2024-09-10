"use client"

import * as React from "react"
import type { DataTableFilterField } from "~/types"

import type { Category } from "@openalternative/db"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { DateRangePicker } from "~/components/DateRangePicker"
import { DataTable } from "~/components/data-table/DataTable"
import { DataTableHeader } from "~/components/data-table/DataTableHeader"
import { DataTableToolbar } from "~/components/data-table/DataTableToolbar"
import { DataTableViewOptions } from "~/components/data-table/DataTableViewOptions"
import { Button } from "~/components/ui/Button"
import { useDataTable } from "~/hooks/use-data-table"
import type { getCategories } from "../_lib/queries"
import { getColumns } from "./CategoriesTableColumns"
import { CategoriesTableToolbarActions } from "./CategoriesTableToolbarActions"

interface CategoriesTableProps {
  categoriesPromise: ReturnType<typeof getCategories>
}

export function CategoriesTable({ categoriesPromise }: CategoriesTableProps) {
  const { data, pageCount } = React.use(categoriesPromise)

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
  const filterFields: DataTableFilterField<Category>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Filter by name...",
    },
    // {
    //   label: "Status",
    //   value: "status",
    //   options: categories.status.enumValues.map(status => ({
    //     label: status[0]?.toUpperCase() + status.slice(1),
    //     value: status,
    //     icon: getStatusIcon(status),
    //     withCount: true,
    //   })),
    // },
    // {
    //   label: "Priority",
    //   value: "priority",
    //   options: categories.priority.enumValues.map(priority => ({
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
        title="Categories"
        callToAction={
          <Button size="sm" prefix={<PlusIcon />} asChild>
            <Link href="/categories/new">New category</Link>
          </Button>
        }
      >
        <DataTableToolbar table={table} filterFields={filterFields}>
          <CategoriesTableToolbarActions table={table} />
          <DateRangePicker triggerSize="sm" triggerClassName="ml-auto" align="end" />
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  )
}
