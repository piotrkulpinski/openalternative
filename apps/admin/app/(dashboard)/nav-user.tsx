"use client"

import { ChevronsUpDown, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import type { ComponentProps } from "react"
import { Avatar, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { config } from "~/config"
import { cx } from "~/utils/cva"

interface NavUserProps extends ComponentProps<"nav"> {
  isCollapsed: boolean
}

export const NavUser = ({ className, isCollapsed, ...props }: NavUserProps) => {
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  return (
    <nav
      className={cx(
        "flex flex-col gap-1 p-3 group-data-[collapsed=true]/collapsible:justify-center group-data-[collapsed=true]/collapsible:px-2",
        className,
      )}
      {...props}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={isCollapsed ? "sm" : "md"}
            prefix={
              session.user.image ? (
                <Avatar className="size-5">
                  <AvatarImage src={session.user.image} />
                </Avatar>
              ) : (
                <User />
              )
            }
            suffix={!isCollapsed && <ChevronsUpDown className="ml-auto text-muted-foreground" />}
            className={cx(!isCollapsed && "justify-start")}
            aria-label={session.user.name ?? "User"}
          >
            {isCollapsed ? null : session.user.name}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="top"
          align="start"
          className="min-w-[var(--radix-dropdown-menu-trigger-width)]"
        >
          <DropdownMenuItem asChild>
            <Link href={config.site.url} target="_blank">
              Visit Site
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <button type="button" onClick={() => signOut()}>
              Sign Out
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
