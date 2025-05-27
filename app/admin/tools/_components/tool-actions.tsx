"use client"

import { isValidUrl } from "@primoui/utils"
import type { Tool } from "@prisma/client"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { type ComponentProps, useState } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { ToolsDeleteDialog } from "~/app/admin/tools/_components/tools-delete-dialog"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { analyzeToolStack, fetchToolRepositoryData } from "~/server/admin/tools/actions"
import { cx } from "~/utils/cva"

type ToolActionsProps = ComponentProps<typeof Button> & {
  tool: Tool
}

export const ToolActions = ({ className, tool, ...props }: ToolActionsProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const actions = [
    {
      action: fetchToolRepositoryData,
      label: "Fetch Repository Data",
      successMessage: "Repository data fetched successfully",
    },
    {
      action: analyzeToolStack,
      label: "Analyze Stack",
      successMessage: "Tool stack analyzed successfully",
    },
  ] as const

  const toolActions = actions.map(({ label, action, successMessage }) => ({
    label,
    execute: useServerAction(action, {
      onSuccess: () => toast.success(successMessage),
      onError: ({ err }) => toast.error(err.message),
    }).execute,
  }))

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

      <DropdownMenuContent align="end">
        {pathname !== `/admin/tools/${tool.slug}` && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/tools/${tool.slug}`}>Edit</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href={`/${tool.slug}`} target="_blank">
            View
          </Link>
        </DropdownMenuItem>

        {toolActions.map(({ label, execute }) => (
          <DropdownMenuItem key={label} onSelect={() => execute({ id: tool.id })}>
            {label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {isValidUrl(tool.websiteUrl) && (
          <DropdownMenuItem asChild>
            <Link href={tool.websiteUrl} target="_blank">
              Visit website
            </Link>
          </DropdownMenuItem>
        )}

        {isValidUrl(tool.repositoryUrl) && (
          <DropdownMenuItem asChild>
            <Link href={tool.repositoryUrl} target="_blank">
              Visit repository
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <ToolsDeleteDialog
        open={isDeleteOpen}
        onOpenChange={() => setIsDeleteOpen(false)}
        tools={[tool]}
        showTrigger={false}
        onSuccess={() => router.push("/admin/tools")}
      />
    </DropdownMenu>
  )
}
