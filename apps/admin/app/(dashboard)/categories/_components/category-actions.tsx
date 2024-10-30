"use client"

import type { Category } from "@openalternative/db"
import type { Row } from "@tanstack/react-table"
import { EllipsisIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { CategoriesDeleteDialog } from "~/app/(dashboard)/categories/_components/categories-delete-dialog"
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

interface CategoryActionsProps extends React.ComponentPropsWithoutRef<typeof Button> {
  category: Category
  row?: Row<Category>
}

export const CategoryActions = ({ category, row, className, ...props }: CategoryActionsProps) => {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDialogSuccess = () => {
    setShowDeleteDialog(false)
    row?.toggleSelected(false)
    router.push("/categories")
  }

  return (
    <>
      <CategoriesDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        categories={[category]}
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
            <Link href={`/categories/${category.id}`}>Edit</Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`${config.site.url}/categories/${category.slug}`} target="_blank">
              View
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
