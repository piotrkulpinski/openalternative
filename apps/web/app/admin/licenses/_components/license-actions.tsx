"use client"

import type { License } from "@openalternative/db/client"
import { EllipsisIcon } from "lucide-react"
import type { ComponentProps, Dispatch, SetStateAction } from "react"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Link } from "~/components/common/link"
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
          variant="secondary"
          size="sm"
          prefix={<EllipsisIcon />}
          className={cx("data-[state=open]:bg-accent", className)}
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
