"use client"

import type { Tool } from "@openalternative/db"
import type { Row } from "@tanstack/react-table"
import { EllipsisIcon } from "lucide-react"
import Link from "next/link"
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
import { siteConfig } from "~/config/site"
import { cx } from "~/utils/cva"

interface ToolActionsProps extends React.ComponentPropsWithoutRef<typeof Button> {
  tool: Tool
  row?: Row<Tool>
}

export const ToolActions = ({ tool, row, className, ...props }: ToolActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showcheduleDialog, setShowcheduleDialog] = useState(false)

  const { execute: reuploadAssetsAction } = useServerAction(reuploadToolAssets, {
    onSuccess: () => {
      toast.success("Tool assets reuploaded")
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  const handleDialogSuccess = () => {
    setShowDeleteDialog(false)
    row?.toggleSelected(false)
  }

  return (
    <>
      <ToolsDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        tools={[tool]}
        showTrigger={false}
        onSuccess={handleDialogSuccess}
      />

      <ToolScheduleDialog
        open={showcheduleDialog}
        onOpenChange={setShowcheduleDialog}
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

          {!tool.publishedAt && (
            <DropdownMenuItem
              onSelect={() => setShowcheduleDialog(true)}
              className="text-green-600 dark:text-green-400"
            >
              Schedule
            </DropdownMenuItem>
          )}

          {tool.publishedAt && tool.publishedAt <= new Date() && (
            <DropdownMenuItem asChild>
              <Link href={`${siteConfig.url}/${tool.slug}`} target="_blank">
                View
              </Link>
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

          <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className="text-red-500">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
