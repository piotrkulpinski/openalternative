"use client"

import type { Alternative } from "@openalternative/db"
import type { Table } from "@tanstack/react-table"
import { DeleteAlternativesDialog } from "./delete-alternatives-dialog"

interface AlternativesTableToolbarActionsProps {
  table: Table<Alternative>
}

export function AlternativesTableToolbarActions({ table }: AlternativesTableToolbarActionsProps) {
  return (
    <>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteAlternativesDialog
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
