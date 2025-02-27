"use client"

import type { Alternative } from "@openalternative/db/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AlternativeActions } from "~/app/admin/alternatives/_components/alternative-actions"
import { AlternativesDeleteDialog } from "~/app/admin/alternatives/_components/alternatives-delete-dialog"
import type { DataTableRowAction } from "~/types"

type UpdateAlternativeActionProps = {
  alternative: Alternative
}

export const UpdateAlternativeActions = ({ alternative }: UpdateAlternativeActionProps) => {
  const router = useRouter()
  const [rowAction, setRowAction] = useState<DataTableRowAction<Alternative> | null>(null)

  return (
    <>
      <AlternativeActions alternative={alternative} setRowAction={setRowAction} />

      <AlternativesDeleteDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        alternatives={rowAction?.data ? [rowAction?.data] : []}
        showTrigger={false}
        onSuccess={() => router.push("/admin/alternatives")}
      />
    </>
  )
}
