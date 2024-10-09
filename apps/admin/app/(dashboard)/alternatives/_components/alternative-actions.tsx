"use client"

import type { Alternative } from "@openalternative/db"
import type { Row } from "@tanstack/react-table"
import { EllipsisIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { AlternativesDeleteDialog } from "~/app/(dashboard)/alternatives/_components/alternatives-delete-dialog"
import { reuploadAlternativeAssets } from "~/app/(dashboard)/alternatives/_lib/actions"
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
  const [showAlternativesDeleteDialog, setShowAlternativesDeleteDialog] = useState(false)

  const { execute: reuploadAssets } = useServerAction(reuploadAlternativeAssets, {
    onSuccess: () => {
      toast.success("Alternative assets reuploaded")
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  return (
    <>
      <AlternativesDeleteDialog
        open={showAlternativesDeleteDialog}
        onOpenChange={setShowAlternativesDeleteDialog}
        alternatives={[alternative]}
        showTrigger={false}
        onSuccess={() => row?.toggleSelected(false) || router.push("/alternatives")}
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
            <Link href={`/alternatives/${alternative.id}`}>Edit</Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`${siteConfig.url}/alternatives/${alternative.slug}`} target="_blank">
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
            onSelect={() => setShowAlternativesDeleteDialog(true)}
            className="text-red-500"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
