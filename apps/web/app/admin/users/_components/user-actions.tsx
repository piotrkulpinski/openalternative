"use client"

import type { User } from "@openalternative/db/client"
import { useRouter } from "next/navigation"
import { type ComponentProps, type Dispatch, type SetStateAction, useTransition } from "react"
import { toast } from "sonner"
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
import type { DataTableRowAction } from "~/types"
import { cx } from "~/utils/cva"

type UserActionsProps = ComponentProps<typeof Button> & {
  user: User
  setRowAction: Dispatch<SetStateAction<DataTableRowAction<User> | null>>
}

export const UserActions = ({ user, setRowAction, className, ...props }: UserActionsProps) => {
  const { data: session } = useSession()
  const [isUpdatePending, startUpdateTransition] = useTransition()
  const router = useRouter()

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

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/users/${user.id}`}>Edit</Link>
        </DropdownMenuItem>

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

        <DropdownMenuItem
          onSelect={() => {
            toast.promise(
              async () => {
                await admin.impersonateUser({ userId: user.id })
                router.refresh()
              },
              {
                loading: "Impersonating...",
                success: "User successfully impersonated",
                error: err => getErrorMessage(err),
              },
            )
          }}
        >
          Impersonate
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => setRowAction({ data: user, type: "delete" })}
          className="text-red-500"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
