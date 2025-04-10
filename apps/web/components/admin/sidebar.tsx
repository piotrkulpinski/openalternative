"use client"

import { useHotkeys, useMediaQuery } from "@mantine/hooks"
import { cx } from "cva"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { CommandMenu } from "~/components/admin/command-menu"
import { Nav } from "~/components/admin/nav"
import { Kbd } from "~/components/common/kbd"
import { siteConfig } from "~/config/site"
import { signOut } from "~/lib/auth-client"
import { Icon } from "../common/icon"

export const Sidebar = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()

  useHotkeys(
    [
      ["mod+K", () => setIsCommandOpen(prev => !prev)],
      ["mod+1", () => handleRedirect("/admin/tools/new")],
      ["mod+2", () => handleRedirect("/admin/alternatives/new")],
      ["mod+3", () => handleRedirect("/admin/categories/new")],
    ],
    [],
    true,
  )

  const handleRedirect = (path: string) => {
    router.push(path)
    setIsCommandOpen(false)
  }

  const handleSignOut = async () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("You've been signed out successfully")
          router.push("/")
        },
      },
    })
  }

  return (
    <>
      <Nav
        isCollapsed={!!isMobile}
        className={cx("sticky top-0 h-dvh z-40 border-r", isMobile ? "w-12" : "w-48")}
        links={[
          {
            title: "Dashboard",
            href: "/admin",
            prefix: <Icon name="lucide/layout-dashboard" />,
          },

          undefined, // Separator

          {
            title: "Tools",
            href: "/admin/tools",
            prefix: <Icon name="lucide/gem" />,
          },
          {
            title: "Alternatives",
            href: "/admin/alternatives",
            prefix: <Icon name="lucide/replace" />,
          },
          {
            title: "Categories",
            href: "/admin/categories",
            prefix: <Icon name="lucide/gallery-horizontal-end" />,
          },
          {
            title: "Users",
            href: "/admin/users",
            prefix: <Icon name="lucide/users" />,
          },

          undefined, // Separator

          {
            title: "Quick Menu",
            href: "#",
            onClick: () => setIsCommandOpen(true),
            prefix: <Icon name="lucide/dock" />,
            suffix: (
              <Kbd meta className="size-auto">
                K
              </Kbd>
            ),
          },
          {
            title: "Visit Site",
            href: siteConfig.url,
            prefix: <Icon name="lucide/globe" />,
          },
          {
            title: "Sign Out",
            href: "#",
            onClick: handleSignOut,
            prefix: <Icon name="lucide/log-out" />,
          },
        ]}
      />

      <CommandMenu isOpen={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </>
  )
}
