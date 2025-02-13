"use client"

import type { Tool } from "@openalternative/db/client"
import { EllipsisIcon } from "lucide-react"
import type { ComponentProps, Dispatch, SetStateAction } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Link } from "~/components/common/link"
import { reuploadToolAssets } from "~/server/admin/tools/actions"
import type { DataTableRowAction } from "~/types"
import { cx } from "~/utils/cva"

type ToolActionsProps = ComponentProps<typeof Button> & {
  tool: Tool
  setRowAction: Dispatch<SetStateAction<DataTableRowAction<Tool> | null>>
}

export const ToolActions = ({ className, tool, setRowAction, ...props }: ToolActionsProps) => {
  const { execute: reuploadAssetsAction } = useServerAction(reuploadToolAssets, {
    onSuccess: () => {
      toast.success("Tool assets reuploaded")
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })


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
          <Link href={`/admin/tools/${tool.slug}`}>Edit</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/${tool.slug}`} target="_blank">
            View
          </Link>
        </DropdownMenuItem>

        {!tool.publishedAt && (
          <DropdownMenuItem
            onSelect={() => setRowAction({ data: tool, type: "schedule" })}
            className="text-green-600"
          >
            Schedule
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onSelect={() => reuploadAssetsAction({ id: tool.id })}>
          Reupload Assets
        </DropdownMenuItem>


        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={tool.websiteUrl} target="_blank">
            Visit website
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={tool.repositoryUrl} target="_blank">
            Visit repository
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => setRowAction({ data: tool, type: "delete" })}
          className="text-red-500"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
