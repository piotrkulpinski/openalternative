"use client"

import type { License } from "@openalternative/db/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LicenseActions } from "~/app/admin/licenses/_components/license-actions"
import { LicensesDeleteDialog } from "~/app/admin/licenses/_components/licenses-delete-dialog"
import type { DataTableRowAction } from "~/types"

type UpdateLicenseActionProps = {
  license: License
}

export const UpdateLicenseActions = ({ license }: UpdateLicenseActionProps) => {
  const router = useRouter()
  const [rowAction, setRowAction] = useState<DataTableRowAction<License> | null>(null)

  return (
    <>
      <LicenseActions license={license} setRowAction={setRowAction} />

      <LicensesDeleteDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        licenses={rowAction?.data ? [rowAction?.data] : []}
        showTrigger={false}
        onSuccess={() => router.push("/admin/licenses")}
      />
    </>
  )
}
