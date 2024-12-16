"use client"

import type { Alternative } from "@openalternative/db/client"
import type { Row } from "@tanstack/react-table"
import { EllipsisIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { AlternativesDeleteDialog } from "~/app/admin/alternatives/_components/alternatives-delete-dialog"
import { Button } from "~/components/admin/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/admin/ui/dropdown-menu"
import { reuploadAlternativeAssets } from "~/server/admin/alternatives/actions"
import { cx } from "~/utils/cva"

interface AlternativeActionsProps extends React.ComponentPropsWithoutRef<typeof Button> {
  alternative: Alternative
  row?: Row<Alternative>
}

export const AlternativeActions = ({
  alternative,
  row,
  className,
  ...props
}: AlternativeActionsProps) => {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { execute: reuploadAssets } = useServerAction(reuploadAlternativeAssets, {
    onSuccess: () => {
      toast.success("Alternative assets reuploaded")
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  const handleDialogSuccess = () => {
    setShowDeleteDialog(false)
    row?.toggleSelected(false)
    router.push("/admin/alternatives")
  }

  return (
    <>
      <AlternativesDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        alternatives={[alternative]}
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

          <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className="text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
