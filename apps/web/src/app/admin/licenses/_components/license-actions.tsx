"use client"

import type { License } from "@openalternative/db/client"
import type { Row } from "@tanstack/react-table"
import { EllipsisIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { LicensesDeleteDialog } from "~/app/admin/licenses/_components/licenses-delete-dialog"
import { Button } from "~/components/admin/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/admin/ui/dropdown-menu"
import { cx } from "~/utils/cva"

interface LicenseActionsProps extends React.ComponentPropsWithoutRef<typeof Button> {
  license: License
  row?: Row<License>
}

export const LicenseActions = ({ license, row, className, ...props }: LicenseActionsProps) => {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDialogSuccess = () => {
    setShowDeleteDialog(false)
    row?.toggleSelected(false)
    router.push("/admin/licenses")
  }

  return (
    <>
      <LicensesDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        licenses={[license]}
        showTrigger={false}
        onSuccess={handleDialogSuccess}
      />

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

          <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className="text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
