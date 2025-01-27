"use client"

import { useMediaQuery } from "@mantine/hooks"
import { cx } from "cva"
import {
  CopyrightIcon,
  GalleryHorizontalEndIcon,
  GemIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  ReplaceIcon,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { Nav } from "~/components/admin/nav"
import { NavMain } from "~/components/admin/nav-main"
import { Separator } from "~/components/admin/ui/separator"
import { siteConfig } from "~/config/site"

export const Sidebar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div
      className={cx("sticky top-0 h-dvh z-40 flex flex-col border-r", isMobile ? "w-12" : "w-48")}
    >
      <Nav>
        <NavMain
          isCollapsed={!!isMobile}
          links={[
            {
              title: "Dashboard",
              href: "/admin",
              prefix: <LayoutDashboardIcon />,
            },
          ]}
        />
      </Nav>

      <Separator />

      <Nav>
        <NavMain
          isCollapsed={!!isMobile}
          links={[
            {
              title: "Tools",
              href: "/admin/tools",
              prefix: <GemIcon />,
            },
            {
              title: "Alternatives",
              href: "/admin/alternatives",
              prefix: <ReplaceIcon />,
            },
            {
              title: "Categories",
              href: "/admin/categories",
              prefix: <GalleryHorizontalEndIcon />,
            },
            {
              title: "Licenses",
              href: "/admin/licenses",
              prefix: <CopyrightIcon />,
            },
          ]}
        />
      </Nav>

      <Nav className="mt-auto">
        <NavMain
          isCollapsed={!!isMobile}
          links={[
            {
              title: "Visit Site",
              href: siteConfig.url,
              prefix: <GlobeIcon />,
            },
            {
              title: "Sign Out",
              href: "#",
              onClick: () => signOut(),
              prefix: <LogOutIcon />,
            },
          ]}
        />
      </Nav>
    </div>
  )
}
