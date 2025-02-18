"use client"

import { LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import { navLinkVariants } from "~/components/web/ui/nav-link"
import { signOut } from "~/lib/auth-client"
import { cx } from "~/utils/cva"

export const UserLogout = ({ className, ...props }: ComponentProps<"button">) => {
  const router = useRouter()

  const handleSignOut = async () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh()
          toast.success("You've been signed out successfully")
        },
      },
    })
  }

  return (
    <button
      type="button"
      className={cx(navLinkVariants({ className }))}
      {...props}
      onClick={handleSignOut}
    >
      <LogOutIcon className="shrink-0 size-4 opacity-75" />
      Logout
    </button>
  )
}
