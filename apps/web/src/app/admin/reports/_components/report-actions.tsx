"use client"

import type { Report } from "@openalternative/db/client"
import { EllipsisIcon } from "lucide-react"
import type { ComponentProps, Dispatch, SetStateAction } from "react"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import type { DataTableRowAction } from "~/types"
import { cx } from "~/utils/cva"

type ReportActionsProps = ComponentProps<typeof Button> & {
  report: Report
  setRowAction: Dispatch<SetStateAction<DataTableRowAction<Report> | null>>
}

export const ReportActions = ({
  report,
  setRowAction,
  className,
  ...props
}: ReportActionsProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open menu"
          variant="secondary"
          size="sm"
          prefix={<EllipsisIcon />}
          className={cx("data-[state=open]:bg-accent", className)}
          {...props}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => setRowAction({ data: report, type: "delete" })}
          className="text-red-500"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
