"use client"

import type { User } from "@openalternative/db/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { UserActions } from "~/app/admin/users/_components/user-actions"
import { UsersDeleteDialog } from "~/app/admin/users/_components/users-delete-dialog"
import type { DataTableRowAction } from "~/types"

type UpdateUserActionProps = {
  user: User
}

export const UpdateUserActions = ({ user }: UpdateUserActionProps) => {
  const router = useRouter()
  const [rowAction, setRowAction] = useState<DataTableRowAction<User> | null>(null)

  return (
    <>
      <UserActions user={user} setRowAction={setRowAction} />

      <UsersDeleteDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        users={rowAction?.data ? [rowAction?.data] : []}
        showTrigger={false}
        onSuccess={() => router.push("/admin/users")}
      />
    </>
  )
}
