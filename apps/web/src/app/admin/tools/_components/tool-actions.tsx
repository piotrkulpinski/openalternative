"use client"

import type { Tool } from "@openalternative/db/client"
import { EllipsisIcon } from "lucide-react"
import Link from "next/link"
import type { ComponentProps, Dispatch, SetStateAction } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/admin/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/admin/ui/dropdown-menu"
import { analyzeToolStack, reuploadToolAssets } from "~/server/admin/tools/actions"
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

  const { execute: analyzeToolStackAction } = useServerAction(analyzeToolStack, {
    onSuccess: () => {
      toast.success("Tool stack analyzed")
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
          variant="outline"
          size="sm"
          prefix={<EllipsisIcon />}
          className={cx("size-7 data-[state=open]:bg-muted", className)}
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

        <DropdownMenuItem onSelect={() => analyzeToolStackAction({ id: tool.id })}>
          Analyze Stack
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
