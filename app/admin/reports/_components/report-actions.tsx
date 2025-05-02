"use client"

import type { Report } from "@prisma/client"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { type ComponentProps, useState } from "react"
import { ReportsDeleteDialog } from "~/app/admin/reports/_components/reports-delete-dialog"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { cx } from "~/utils/cva"

type ReportActionsProps = ComponentProps<typeof Button> & {
  report: Report
}

export const ReportActions = ({ report, className, ...props }: ReportActionsProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open menu"
          variant="secondary"
          size="sm"
          prefix={<Icon name="lucide/ellipsis" />}
          className={cx("data-[state=open]:bg-accent", className)}
          {...props}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8}>
        {pathname !== `/admin/reports/${report.id}` && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/reports/${report.id}`}>Edit</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <ReportsDeleteDialog
        open={isDeleteOpen}
        onOpenChange={() => setIsDeleteOpen(false)}
        reports={[report]}
        showTrigger={false}
        onSuccess={() => router.push("/admin/reports")}
      />
    </DropdownMenu>
  )
}
