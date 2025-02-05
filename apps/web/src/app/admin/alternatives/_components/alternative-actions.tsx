"use client"

import type { Alternative } from "@openalternative/db/client"
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
import { reuploadAlternativeAssets } from "~/server/admin/alternatives/actions"
import type { DataTableRowAction } from "~/types"
import { cx } from "~/utils/cva"

type AlternativeActionsProps = ComponentProps<typeof Button> & {
  alternative: Alternative
  setRowAction: Dispatch<SetStateAction<DataTableRowAction<Alternative> | null>>
}

export const AlternativeActions = ({
  alternative,
  setRowAction,
  className,
  ...props
}: AlternativeActionsProps) => {
  const { execute: reuploadAssets } = useServerAction(reuploadAlternativeAssets, {
    onSuccess: () => {
      toast.success("Alternative assets reuploaded")
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
          <Link href={`/admin/alternatives/${alternative.slug}`}>Edit</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/alternatives/${alternative.slug}`} target="_blank">
            View
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => reuploadAssets({ id: alternative.id })}>
          Reupload Assets
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={alternative.website} target="_blank">
            Visit website
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => setRowAction({ data: alternative, type: "delete" })}
          className="text-red-500"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
