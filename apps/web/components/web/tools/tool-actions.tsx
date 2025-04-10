"use client"

import Link from "next/link"
import type { ComponentProps } from "react"
import { useState } from "react"
import { Button } from "~/components/common/button"
import { Icon } from "~/components/common/icon"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { ToolClaimDialog } from "~/components/web/dialogs/tool-claim-dialog"
import { ToolReportDialog } from "~/components/web/dialogs/tool-report-dialog"
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
    <Stack size="sm" wrap={false} className={cx("justify-end", className)} {...props}>
      {!tool.isFeatured && tool.owner && tool.owner.id === session?.user.id && (
        <Button
          size="md"
          variant="secondary"
          prefix={<Icon name="lucide/sparkles" className="text-inherit" />}
          className="text-blue-600 dark:text-blue-400"
          asChild
        >
          <Link href={`/submit/${tool.slug}`}>Promote</Link>
        </Button>
      )}

      {!tool.owner && (
        <Button
          size="md"
          variant="secondary"
          prefix={<Icon name="lucide/badge-check" className="text-inherit" />}
          onClick={() => setIsClaimOpen(true)}
          className="text-blue-600 dark:text-blue-400"
        >
          Claim
        </Button>
      )}

      <Tooltip tooltip="Send a report/suggestion">
        <Button
          size="md"
          variant="secondary"
          prefix={<Icon name="lucide/triangle-alert" />}
          onClick={() => setIsReportOpen(true)}
          aria-label="Report"
        />
      </Tooltip>

      {children}

      <ToolReportDialog tool={tool} isOpen={isReportOpen} setIsOpen={setIsReportOpen} />

      {!tool.owner && (
        <ToolClaimDialog tool={tool} isOpen={isClaimOpen} setIsOpen={setIsClaimOpen} />
      )}
    </Stack>
  )
}
