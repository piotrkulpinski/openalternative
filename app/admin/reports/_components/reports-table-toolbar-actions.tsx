"use client"

import type { Report } from "@prisma/client"
import type { Table } from "@tanstack/react-table"
import { ReportsDeleteDialog } from "./reports-delete-dialog"

interface ReportsTableToolbarActionsProps {
  table: Table<Report>
}

export function ReportsTableToolbarActions({ table }: ReportsTableToolbarActionsProps) {
  return (
    <>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <ReportsDeleteDialog
          reports={table.getFilteredSelectedRowModel().rows.map(row => row.original)}
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
