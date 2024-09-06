"use client"

import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { Button, type ButtonProps } from "~/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu"
import { cx } from "~/utils/cva"

export const User = ({ className, ...props }: ButtonProps) => {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cx("overflow-clip rounded-full", className)}
          {...props}
        >
          <Image
            src={user?.image ?? "/placeholder-user.jpg"}
            width={36}
            height={36}
            alt="Avatar"
            className="size-8"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="https://openalternative.co" target="_blank">
            Visit Site
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {user ? (
          <DropdownMenuItem asChild>
            <button type="button" onClick={() => signOut()}>
              Sign Out
            </button>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/signin">Sign In</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
