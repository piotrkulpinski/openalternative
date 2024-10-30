"use client"

import type { Tool } from "@openalternative/db"
import type { Row } from "@tanstack/react-table"
import { EllipsisIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { ToolScheduleDialog } from "~/app/(dashboard)/tools/_components/tool-schedule-dialog"
import { ToolsDeleteDialog } from "~/app/(dashboard)/tools/_components/tools-delete-dialog"
import { reuploadToolAssets } from "~/app/(dashboard)/tools/_lib/actions"
import { Button } from "~/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { config } from "~/config"
import { cx } from "~/utils/cva"

interface ToolActionsProps extends React.ComponentPropsWithoutRef<typeof Button> {
  tool: Tool
  row?: Row<Tool>
}

export const ToolActions = ({ tool, row, className, ...props }: ToolActionsProps) => {
  const router = useRouter()
  const [dialog, setDialog] = useState<"delete" | "schedule" | null>(null)

  const { execute: reuploadAssetsAction } = useServerAction(reuploadToolAssets, {
    onSuccess: () => {
      toast.success("Tool assets reuploaded")
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  const handleDialogSuccess = () => {
    setDialog(null)
    row?.toggleSelected(false)
    router.push("/tools")
  }

  return (
    <>
      <ToolsDeleteDialog
        open={dialog === "delete"}
        onOpenChange={open => setDialog(open ? "delete" : null)}
        tools={[tool]}
        showTrigger={false}
        onSuccess={handleDialogSuccess}
      />

      <ToolScheduleDialog
        open={dialog === "schedule"}
        onOpenChange={open => setDialog(open ? "schedule" : null)}
        tool={tool}
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
            <Link href={`/tools/${tool.id}`}>Edit</Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`${config.site.url}/${tool.slug}?preview=${tool.id}`} target="_blank">
              View
            </Link>
          </DropdownMenuItem>

          {!tool.publishedAt && (
            <DropdownMenuItem onSelect={() => setDialog("schedule")} className="text-green-600">
              Schedule
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onSelect={() => reuploadAssetsAction({ id: tool.id })}>
            Reupload Assets
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href={tool.website} target="_blank">
              Visit website
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={tool.repository} target="_blank">
              Visit repository
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setDialog("delete")} className="text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
