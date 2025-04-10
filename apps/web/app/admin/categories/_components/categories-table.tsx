"use client"

import type { Category } from "@openalternative/db/client"
import { useQueryStates } from "nuqs"
import { use } from "react"
import { useMemo, useState } from "react"
import { CategoriesDeleteDialog } from "~/app/admin/categories/_components/categories-delete-dialog"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableHeader } from "~/components/data-table/data-table-header"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { DataTableViewOptions } from "~/components/data-table/data-table-view-options"
import { useDataTable } from "~/hooks/use-data-table"
import type { findCategories } from "~/server/admin/categories/queries"
import { categoriesTableParamsSchema } from "~/server/admin/categories/schemas"
import type { DataTableFilterField, DataTableRowAction } from "~/types"
import { getColumns } from "./categories-table-columns"
import { CategoriesTableToolbarActions } from "./categories-table-toolbar-actions"
import { Icon } from "~/components/common/icon"

type CategoriesTableProps = {
  categoriesPromise: ReturnType<typeof findCategories>
}

export function CategoriesTable({ categoriesPromise }: CategoriesTableProps) {
  const { categories, categoriesTotal, pageCount } = use(categoriesPromise)
  const [{ perPage, sort }] = useQueryStates(categoriesTableParamsSchema)
  const [rowAction, setRowAction] = useState<DataTableRowAction<Category> | null>(null)

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns({ setRowAction }), [])

  // Search filters
  const filterFields: DataTableFilterField<Category>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Search by name...",
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
          title="Categories"
          total={categoriesTotal}
          callToAction={
            <Button variant="primary" size="md" prefix={<Icon name="lucide/plus" />} asChild>
              <Link href="/admin/categories/new">
                <div className="max-sm:sr-only">New category</div>
              </Link>
            </Button>
          }
        >
          <DataTableToolbar table={table} filterFields={filterFields}>
            <CategoriesTableToolbarActions table={table} />
            <DateRangePicker align="end" />
            <DataTableViewOptions table={table} />
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
