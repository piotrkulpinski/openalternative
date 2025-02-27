"use client"

import type { Tool } from "@openalternative/db/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ToolActions } from "~/app/admin/tools/_components/tool-actions"
import { ToolScheduleDialog } from "~/app/admin/tools/_components/tool-schedule-dialog"
import { ToolsDeleteDialog } from "~/app/admin/tools/_components/tools-delete-dialog"
import type { DataTableRowAction } from "~/types"

type UpdateToolActionProps = {
  tool: Tool
}

export const UpdateToolActions = ({ tool }: UpdateToolActionProps) => {
  const router = useRouter()
  const [rowAction, setRowAction] = useState<DataTableRowAction<Tool> | null>(null)

  return (
    <>
      <ToolActions tool={tool} setRowAction={setRowAction} />

      <ToolScheduleDialog
        open={rowAction?.type === "schedule"}
        onOpenChange={() => setRowAction(null)}
        tool={rowAction?.data}
        showTrigger={false}
      />

      <ToolsDeleteDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        tools={rowAction?.data ? [rowAction?.data] : []}
        showTrigger={false}
        onSuccess={() => router.push("/admin/tools")}
      />
    </>
  )
}
