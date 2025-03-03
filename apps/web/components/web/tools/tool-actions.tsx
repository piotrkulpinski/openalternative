"use client"

import { EllipsisIcon, ShieldPlusIcon, SparklesIcon, TriangleAlertIcon } from "lucide-react"
import Link from "next/link"
import type { ComponentProps } from "react"
import { useState } from "react"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Stack } from "~/components/common/stack"
import { TooltipProvider } from "~/components/common/tooltip"
import { ToolClaimDialog } from "~/components/web/dialogs/tool-claim-dialog"
import { ToolReportDialog } from "~/components/web/dialogs/tool-report-dialog"
import { Beam } from "~/components/web/ui/beam"
import { navLinkVariants } from "~/components/web/ui/nav-link"
import { useSession } from "~/lib/auth-client"
import type { ToolOne } from "~/server/web/tools/payloads"
import { cx } from "~/utils/cva"

type ToolActionsProps = ComponentProps<typeof Stack> & {
  tool: ToolOne
}

export const ToolActions = ({ tool, children, className, ...props }: ToolActionsProps) => {
  const { data: session } = useSession()
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isClaimOpen, setIsClaimOpen] = useState(false)

  return (
    <TooltipProvider delayDuration={250}>
      <Stack size="sm" wrap={false} className={cx("justify-end", className)} {...props}>
        {!tool.isFeatured && tool.owner && tool.owner?.email === session?.user.email && (
          <Button variant="secondary" prefix={<SparklesIcon className="text-yellow-500" />} asChild>
            <Link href={`/submit/${tool.slug}`}>
              Promote
              <Beam />
            </Link>
          </Button>
        )}

        {!tool.owner && (
          <Button
            variant="secondary"
            prefix={<ShieldPlusIcon className="text-yellow-500" />}
            onClick={() => setIsClaimOpen(true)}
          >
            Claim
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" prefix={<EllipsisIcon />} />
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" align="end" className="min-w-36">
            <DropdownMenuItem asChild>
              <button
                type="button"
                className={navLinkVariants()}
                onClick={() => setIsReportOpen(true)}
              >
                <TriangleAlertIcon className="shrink-0 size-4 opacity-75" />
                Report
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {children}
      </Stack>

      <ToolReportDialog tool={tool} isOpen={isReportOpen} setIsOpen={setIsReportOpen} />

      {!tool.owner && (
        <ToolClaimDialog tool={tool} isOpen={isClaimOpen} setIsOpen={setIsClaimOpen} />
      )}
    </TooltipProvider>
  )
}
