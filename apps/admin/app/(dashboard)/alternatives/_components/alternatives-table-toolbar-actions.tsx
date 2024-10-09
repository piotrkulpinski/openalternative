"use client"

import type { Alternative } from "@openalternative/db"
import type { Table } from "@tanstack/react-table"
import { AlternativesDeleteDialog } from "./alternatives-delete-dialog"

interface AlternativesTableToolbarActionsProps {
  table: Table<Alternative>
}

export function AlternativesTableToolbarActions({ table }: AlternativesTableToolbarActionsProps) {
  return (
    <>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <AlternativesDeleteDialog
          alternatives={table.getFilteredSelectedRowModel().rows.map(row => row.original)}
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
