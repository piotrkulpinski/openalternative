"use client"

import type { License } from "@openalternative/db/client"
import { EllipsisIcon } from "lucide-react"
import Link from "next/link"
import type { ComponentProps, Dispatch, SetStateAction } from "react"
import { Button } from "~/components/admin/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/admin/ui/dropdown-menu"
import type { DataTableRowAction } from "~/types"
import { cx } from "~/utils/cva"

type LicenseActionsProps = ComponentProps<typeof Button> & {
  license: License
  setRowAction: Dispatch<SetStateAction<DataTableRowAction<License> | null>>
}

export const LicenseActions = ({
  license,
  setRowAction,
  className,
  ...props
}: LicenseActionsProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open menu"
          variant="outline"
          size="sm"
          prefix={<EllipsisIcon />}
          className={cx("size-7 data-[state=open]:bg-muted", className)}
          {...props}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/licenses/${license.slug}`}>Edit</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/licenses/${license.slug}`} target="_blank">
            View
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => setRowAction({ data: license, type: "delete" })}
          className="text-red-500"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
