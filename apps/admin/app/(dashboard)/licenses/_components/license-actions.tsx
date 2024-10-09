"use client"

import type { License } from "@openalternative/db"
import type { Row } from "@tanstack/react-table"
import { EllipsisIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { LicensesDeleteDialog } from "~/app/(dashboard)/licenses/_components/licenses-delete-dialog"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { siteConfig } from "~/config/site"
import { cx } from "~/utils/cva"

interface LicenseActionsProps extends React.ComponentPropsWithoutRef<typeof Button> {
  license: License
  row?: Row<License>
}

export const LicenseActions = ({ license, row, className, ...props }: LicenseActionsProps) => {
  const router = useRouter()
  const [showLicenseDeleteDialog, setShowLicenseDeleteDialog] = useState(false)

  return (
    <>
      <LicensesDeleteDialog
        open={showLicenseDeleteDialog}
        onOpenChange={setShowLicenseDeleteDialog}
        licenses={[license]}
        showTrigger={false}
        onSuccess={() => row?.toggleSelected(false) || router.push("/licenses")}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="outline"
            size="icon"
            prefix={<EllipsisIcon />}
            className={cx("text-muted-foreground data-[state=open]:bg-muted", className)}
            {...props}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/licenses/${license.id}`}>Edit</Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`${siteConfig.url}/licenses/${license.slug}`} target="_blank">
              View
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => setShowLicenseDeleteDialog(true)}
            className="text-red-500"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
