"use client"

import type { License } from "@openalternative/db"
import type { Table } from "@tanstack/react-table"
import { LicensesDeleteDialog } from "./licenses-delete-dialog"

interface LicensesTableToolbarActionsProps {
  table: Table<License>
}

export function LicensesTableToolbarActions({ table }: LicensesTableToolbarActionsProps) {
  return (
    <>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <LicensesDeleteDialog
          licenses={table.getFilteredSelectedRowModel().rows.map(row => row.original)}
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
