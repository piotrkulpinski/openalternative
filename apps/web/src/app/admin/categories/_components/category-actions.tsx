"use client"

import type { Category } from "@openalternative/db/client"
import { EllipsisIcon } from "lucide-react"
import Link from "next/link"
import type { ComponentProps, Dispatch, SetStateAction } from "react"
import { Button } from "~/components/admin/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/admin/ui/dropdown-menu"
import type { DataTableRowAction } from "~/types"
import { cx } from "~/utils/cva"

type CategoryActionsProps = ComponentProps<typeof Button> & {
  category: Category
  setRowAction: Dispatch<SetStateAction<DataTableRowAction<Category> | null>>
}

export const CategoryActions = ({
  category,
  setRowAction,
  className,
  ...props
}: CategoryActionsProps) => {
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
          <Link href={`/admin/categories/${category.slug}`}>Edit</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/categories/${category.slug}`} target="_blank">
            View
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => setRowAction({ data: category, type: "delete" })}
          className="text-red-500"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
