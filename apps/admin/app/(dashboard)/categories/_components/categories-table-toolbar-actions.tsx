"use client"

import type { Category } from "@openalternative/db"
import type { Table } from "@tanstack/react-table"
import { CategoriesDeleteDialog } from "./categories-delete-dialog"

interface CategoriesTableToolbarActionsProps {
  table: Table<Category>
}

export function CategoriesTableToolbarActions({ table }: CategoriesTableToolbarActionsProps) {
  return (
    <>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <CategoriesDeleteDialog
          categories={table.getFilteredSelectedRowModel().rows.map(row => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}

      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </>
  )
}
