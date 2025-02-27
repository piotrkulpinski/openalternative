"use client"

import type { Category } from "@openalternative/db/client"
import { EllipsisIcon } from "lucide-react"
import type { ComponentProps, Dispatch, SetStateAction } from "react"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Link } from "~/components/common/link"
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
          variant="secondary"
          size="sm"
          prefix={<EllipsisIcon />}
          className={cx("data-[state=open]:bg-accent", className)}
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
