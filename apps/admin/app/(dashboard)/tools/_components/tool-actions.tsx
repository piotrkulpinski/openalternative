"use client"

import type { Tool } from "@openalternative/db"
import type { Row } from "@tanstack/react-table"
import { EllipsisIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { DeleteToolsDialog } from "~/app/(dashboard)/tools/_components/delete-tools-dialog"
import { PublishToolDialog } from "~/app/(dashboard)/tools/_components/publish-tool-dialog"
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
  const router = useRouter()
  const [showDeleteToolDialog, setShowDeleteToolDialog] = React.useState(false)
  const [showPublishToolDialog, setShowPublishToolDialog] = React.useState(false)

  const { execute: reuploadAssetsAction } = useServerAction(reuploadToolAssets, {
    onSuccess: () => {
      toast.success("Tool assets reuploaded")
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  return (
    <>
      <DeleteToolsDialog
        open={showDeleteToolDialog}
        onOpenChange={setShowDeleteToolDialog}
        tools={[tool]}
        showTrigger={false}
        onSuccess={() => row?.toggleSelected(false) || router.push("/tools")}
      />

      <PublishToolDialog
        open={showPublishToolDialog}
        onOpenChange={setShowPublishToolDialog}
        tool={tool}
        showTrigger={false}
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
            <Link href={`/tools/${tool.id}`}>Edit</Link>
          </DropdownMenuItem>

          {!tool.publishedAt && (
            <DropdownMenuItem
              onSelect={() => setShowPublishToolDialog(true)}
              className="text-green-600 dark:text-green-400"
            >
              Publish
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

          <DropdownMenuItem onSelect={() => setShowDeleteToolDialog(true)} className="text-red-500">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
