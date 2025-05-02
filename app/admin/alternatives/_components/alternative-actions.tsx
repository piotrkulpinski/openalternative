"use client"

import type { Alternative } from "@prisma/client"
import { usePathname, useRouter } from "next/navigation"
import { type ComponentProps, useState } from "react"
import { AlternativesDeleteDialog } from "~/app/admin/alternatives/_components/alternatives-delete-dialog"
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

type AlternativeActionsProps = ComponentProps<typeof Button> & {
  alternative: Alternative
}

export const AlternativeActions = ({
  alternative,
  className,
  ...props
}: AlternativeActionsProps) => {
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
        {pathname !== `/admin/alternatives/${alternative.slug}` && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/alternatives/${alternative.slug}`}>Edit</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href={`/alternatives/${alternative.slug}`} target="_blank">
            View
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={alternative.websiteUrl} target="_blank">
            Visit website
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <AlternativesDeleteDialog
        open={isDeleteOpen}
        onOpenChange={() => setIsDeleteOpen(false)}
        alternatives={[alternative]}
        showTrigger={false}
        onSuccess={() => router.push("/admin/alternatives")}
      />
    </DropdownMenu>
  )
}
