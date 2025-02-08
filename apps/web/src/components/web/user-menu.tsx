"use client"

import { getInitials } from "@curiousleaf/utils"
import { LogOutIcon, ShieldHalfIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/common/avatar"
import { Box } from "~/components/common/box"
import { Button } from "~/components/web/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/web/ui/dropdown-menu"
import { NavLink, navLinkVariants } from "~/components/web/ui/nav-link"
import { signOut, useSession } from "~/lib/auth-client"

export const UserMenu = () => {
  const { data: session, refetch } = useSession()

  const handleSignOut = async () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          refetch()
          toast.success("You've been signed out successfully")
        },
      },
    })
  }

  if (!session?.user) {
    return (
      <Button size="sm" variant="secondary" asChild>
        <Link href="/auth/login" prefetch={false}>
          Sign in
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Box hover focus>
          <Avatar className="size-6 duration-100">
            <AvatarImage src={session.user.image ?? undefined} />
            <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
          </Avatar>
        </Box>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuLabel className="truncate font-normal leading-relaxed">
          <div className="text-foreground">{session.user.name}</div>
          {session.user.email}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {session.user.isAdmin && (
          <DropdownMenuItem asChild>
            <NavLink href="/admin">
              <ShieldHalfIcon className="shrink-0 size-4 opacity-75" /> Admin Panel
            </NavLink>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <button type="button" className={navLinkVariants()} onClick={handleSignOut}>
            <LogOutIcon className="shrink-0 size-4 opacity-75" />
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
