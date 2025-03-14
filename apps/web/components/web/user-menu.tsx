import { getInitials } from "@curiousleaf/utils"
import { ShieldHalfIcon, UserIcon } from "lucide-react"
import { headers } from "next/headers"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/common/avatar"
import { Box } from "~/components/common/box"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Link } from "~/components/common/link"
import { NavLink } from "~/components/web/ui/nav-link"
import { UserLogout } from "~/components/web/user-logout"
import { auth } from "~/lib/auth"

const UserMenu = async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return (
      <Button size="sm" variant="secondary" asChild>
        <Link href="/auth/login">Sign In</Link>
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
        <DropdownMenuLabel className="max-w-48 truncate font-normal leading-relaxed">
          {session.user.name}

          {session.user.name !== session.user.email && (
            <div className="text-muted-foreground truncate">{session.user.email}</div>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {session.user.role === "admin" && (
          <DropdownMenuItem asChild>
            <NavLink href="/admin">
              <ShieldHalfIcon className="shrink-0 size-4 opacity-75" /> Admin Panel
            </NavLink>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <NavLink href="/dashboard">
            <UserIcon className="shrink-0 size-4 opacity-75" /> Dashboard
          </NavLink>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <UserLogout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const UserMenuSkeleton = () => {
  return (
    <Button size="sm" variant="secondary" disabled>
      Sign In
    </Button>
  )
}

export { UserMenu, UserMenuSkeleton }
