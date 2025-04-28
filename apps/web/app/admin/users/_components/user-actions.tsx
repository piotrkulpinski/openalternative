"use client"

import type { User } from "@prisma/client"
import { usePathname, useRouter } from "next/navigation"
import { type ComponentProps, useState, useTransition } from "react"
import { toast } from "sonner"
import { UsersDeleteDialog } from "~/app/admin/users/_components/users-delete-dialog"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { admin, useSession } from "~/lib/auth-client"
import { getErrorMessage } from "~/lib/handle-error"
import { updateUser } from "~/server/admin/users/actions"
import { cx } from "~/utils/cva"

type UserActionsProps = ComponentProps<typeof Button> & {
  user: User
}

export const UserActions = ({ user, className, ...props }: UserActionsProps) => {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isUpdatePending, startUpdateTransition] = useTransition()
  const roles = ["admin", "user"] as const

  if (user.id === session?.user.id) {
    return null
  }

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

      <DropdownMenuContent align="end" sideOffset={8}>
        {pathname !== `/admin/users/${user.id}` && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/users/${user.id}`}>Edit</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Role</DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={user.role}
              onValueChange={value => {
                startUpdateTransition(() => {
                  toast.promise(
                    async () =>
                      await updateUser({
                        id: user.id,
                        role: value as (typeof roles)[number],
                      }),
                    {
                      loading: "Updating...",
                      success: "Role successfully updated",
                      error: err => getErrorMessage(err),
                    },
                  )
                })
              }}
            >
              {roles.map(role => (
                <DropdownMenuRadioItem
                  key={role}
                  value={role}
                  className="capitalize"
                  disabled={isUpdatePending}
                >
                  {role}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {user.role !== "admin" &&
          (user.banned ? (
            <DropdownMenuItem
              onSelect={() => {
                toast.promise(
                  async () => {
                    await admin.unbanUser({ userId: user.id })
                    router.refresh()
                  },
                  {
                    loading: "Unbanning...",
                    success: "User successfully unbanned",
                    error: err => getErrorMessage(err),
                  },
                )
              }}
            >
              Unban
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onSelect={() => {
                toast.promise(
                  async () => {
                    await admin.banUser({ userId: user.id })
                    router.refresh()
                  },
                  {
                    loading: "Banning...",
                    success: "User successfully banned",
                    error: err => getErrorMessage(err),
                  },
                )
              }}
            >
              Ban
            </DropdownMenuItem>
          ))}

        <DropdownMenuItem
          onSelect={() => {
            toast.promise(admin.revokeUserSessions({ userId: user.id }), {
              loading: "Revoking sessions...",
              success: "Sessions successfully revoked",
              error: err => getErrorMessage(err),
            })
          }}
        >
          Revoke Sessions
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <UsersDeleteDialog
        open={isDeleteOpen}
        onOpenChange={() => setIsDeleteOpen(false)}
        users={[user]}
        showTrigger={false}
        onSuccess={() => router.push("/admin/users")}
      />
    </DropdownMenu>
  )
}
