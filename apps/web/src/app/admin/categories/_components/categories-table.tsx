"use client"

import type { Category } from "@openalternative/db/client"
import { PlusIcon } from "lucide-react"
import * as React from "react"
import { CategoriesDeleteDialog } from "~/app/admin/categories/_components/categories-delete-dialog"
import { DataTable } from "~/components/admin/data-table/data-table"
import { DataTableHeader } from "~/components/admin/data-table/data-table-header"
import { DataTableToolbar } from "~/components/admin/data-table/data-table-toolbar"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { useDataTable } from "~/hooks/use-data-table"
import type { findCategories } from "~/server/admin/categories/queries"
import type { DataTableFilterField, DataTableRowAction } from "~/types"
import { getColumns } from "./categories-table-columns"
import { CategoriesTableToolbarActions } from "./categories-table-toolbar-actions"

type CategoriesTableProps = {
  categoriesPromise: ReturnType<typeof findCategories>
}

export function CategoriesTable({ categoriesPromise }: CategoriesTableProps) {
  const { categories, categoriesTotal, pageCount } = React.use(categoriesPromise)

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Category> | null>(null)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  // Search filters
  const filterFields: DataTableFilterField<Category>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Filter by name...",
    },
  ]

  const { table } = useDataTable({
    data: categories,
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
          title="Categories"
          total={categoriesTotal}
          callToAction={
            <Button variant="fancy" size="md" prefix={<PlusIcon />} asChild>
              <Link href="/admin/categories/new">
                <span className="max-sm:sr-only">New category</span>
              </Link>
            </Button>
          }
        >
          <DataTableToolbar table={table} filterFields={filterFields}>
            <CategoriesTableToolbarActions table={table} />
            <DateRangePicker align="end" />
          </DataTableToolbar>
        </DataTableHeader>
      </DataTable>

      <CategoriesDeleteDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        categories={rowAction?.data ? [rowAction?.data] : []}
        showTrigger={false}
        onSuccess={() => table.toggleAllRowsSelected(false)}
      />
    </>
  )
}
