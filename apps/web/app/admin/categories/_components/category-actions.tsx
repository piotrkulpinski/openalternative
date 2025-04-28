"use client"

import type { Category } from "@openalternative/db/client"
import { usePathname, useRouter } from "next/navigation"
import { type ComponentProps, useState } from "react"
import { CategoriesDeleteDialog } from "~/app/admin/categories/_components/categories-delete-dialog"
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
import { cx } from "~/utils/cva"

type CategoryActionsProps = ComponentProps<typeof Button> & {
  category: Category
}

export const CategoryActions = ({ category, className, ...props }: CategoryActionsProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

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
        {pathname !== `/admin/categories/${category.slug}` && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/categories/${category.slug}`}>Edit</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href={`/categories/${category.fullPath}`} target="_blank">
            View
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <CategoriesDeleteDialog
        open={isDeleteOpen}
        onOpenChange={() => setIsDeleteOpen(false)}
        categories={[category]}
        showTrigger={false}
        onSuccess={() => router.push("/admin/categories")}
      />
    </DropdownMenu>
  )
}
