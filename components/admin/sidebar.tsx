"use client"

import { useMediaQuery } from "@mantine/hooks"
import { cx } from "cva"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Nav } from "~/components/admin/nav"
import { Button } from "~/components/common/button"
import { Icon } from "~/components/common/icon"
import { Kbd } from "~/components/common/kbd"
import { Tooltip } from "~/components/common/tooltip"
import { siteConfig } from "~/config/site"
import { useSearch } from "~/contexts/search-context"
import { signOut } from "~/lib/auth-client"

export const Sidebar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()
  const search = useSearch()

  const handleOpenSite = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    window.open(siteConfig.url, "_self")
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
          prefix: <Icon name="lucide/tags" />,
        },
        {
          title: "Users",
          href: "/admin/users",
          prefix: <Icon name="lucide/users" />,
        },
        {
          title: "Reports",
          href: "/admin/reports",
          prefix: <Icon name="lucide/triangle-alert" />,
        },

        undefined, // Separator

        {
          title: "Visit Site",
          href: "/admin/site",
          prefix: <Icon name="lucide/globe" />,
          suffix: (
            <Tooltip tooltip="Open site in new tab">
              <Button
                variant="secondary"
                onClick={handleOpenSite}
                className="-my-0.5 px-1 py-[0.2em] text-xs/tight rounded-sm"
              >
                <Icon name="lucide/arrow-up-right" className="size-3" />
              </Button>
            </Tooltip>
          ),
        },
        {
          title: "Quick Menu",
          href: "#",
          onClick: search.open,
          prefix: <Icon name="lucide/dock" />,
          suffix: (
            <Kbd meta className="size-auto">
              K
            </Kbd>
          ),
        },
        {
          title: "Sign Out",
          href: "#",
          onClick: handleSignOut,
          prefix: <Icon name="lucide/log-out" />,
        },
      ]}
    />
  )
}
