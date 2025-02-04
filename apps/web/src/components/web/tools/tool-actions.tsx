"use client"

import { BookmarkPlusIcon, EllipsisIcon, TriangleAlertIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import type { HTMLAttributes } from "react"
import { startTransition, useOptimistic } from "react"
import { toast } from "sonner"
import { Stack } from "~/components/common/stack"
import { Button } from "~/components/web/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/web/ui/dropdown-menu"
import { navLinkVariants } from "~/components/web/ui/nav-link"
import { Tooltip, TooltipProvider } from "~/components/web/ui/tooltip"
import { toggleBookmark } from "~/server/web/tools/actions"
import type { ToolMany, ToolManyExtended } from "~/server/web/tools/payloads"
import { cx } from "~/utils/cva"

type ToolActionsProps = HTMLAttributes<HTMLElement> & {
  tool: ToolMany | ToolManyExtended
  isBookmarked?: boolean
}

export const ToolActions = ({
  tool,
  isBookmarked = false,
  children,
  className,
  ...props
}: ToolActionsProps) => {
  const pathname = usePathname()
  // const [isPending, startTransition] = useTransition()
  const [bookmarked, setBookmarked] = useOptimistic(isBookmarked)

  const handleBookmark = async () => {
    const newState = !bookmarked

    try {
      startTransition(() => setBookmarked(newState))
      await toggleBookmark({ toolSlug: tool.slug, callbackUrl: pathname })
    } catch (error) {
      toast.error((error as Error).message)
      setBookmarked(!newState)
    }
  }

  return (
    <TooltipProvider delayDuration={250} disableHoverableContent>
      <Stack size="sm" className={cx("flex-nowrap justify-end text-lg", className)} {...props}>
        <DropdownMenu>
          <Tooltip tooltip="More options">
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" prefix={<EllipsisIcon className="-my-1 size-5!" />} />
            </DropdownMenuTrigger>
          </Tooltip>

          <DropdownMenuContent side="bottom" align="end" className="min-w-36">
            <DropdownMenuItem asChild>
              <button type="button" className={navLinkVariants()} onClick={() => {}}>
                <TriangleAlertIcon className="shrink-0 size-4 opacity-75" />
                Report
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip tooltip={bookmarked ? "Remove bookmark" : "Add bookmark"}>
          <Button
            variant={bookmarked ? "fancy" : "secondary"}
            prefix={<BookmarkPlusIcon className="-my-1 size-5!" />}
            onClick={handleBookmark}
            // isPending={isPending}
          />
        </Tooltip>

        {children}
      </Stack>
    </TooltipProvider>
  )
}
