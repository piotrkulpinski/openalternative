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
import { siteConfig } from "~/config/site"
import { cx } from "~/utils/cva"

interface CategoryActionsProps extends React.ComponentPropsWithoutRef<typeof Button> {
  category: Category
  row?: Row<Category>
}

export const CategoryActions = ({ category, row, className, ...props }: CategoryActionsProps) => {
  const router = useRouter()
  const [showCategoriesDeleteDialog, setShowCategoriesDeleteDialog] = useState(false)

  return (
    <>
      <CategoriesDeleteDialog
        open={showCategoriesDeleteDialog}
        onOpenChange={setShowCategoriesDeleteDialog}
        categories={[category]}
        showTrigger={false}
        onSuccess={() => row?.toggleSelected(false) || router.push("/categories")}
      />

      <DropdownMenu>
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
            <Link href={`${siteConfig.url}/categories/${category.slug}`} target="_blank">
              View
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => setShowCategoriesDeleteDialog(true)}
            className="text-red-500"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
