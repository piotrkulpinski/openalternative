"use client"

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
import * as React from "react"
import { Nav } from "~/components/admin/nav"
import { NavMain } from "~/components/admin/nav-main"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/admin/ui/resizable"
import { Separator } from "~/components/admin/ui/separator"
import { siteConfig } from "~/config/site"
import { useIsMobile } from "~/hooks/use-mobile"
import { useStats } from "~/hooks/use-stats-context"
import { cx } from "~/utils/cva"

interface ShellProps extends React.PropsWithChildren {
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize?: number
}

export function Shell({
  children,
  defaultLayout = [20, 48],
  defaultCollapsed = false,
  navCollapsedSize = 0,
}: ShellProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const stats = useStats()
  const isMobile = useIsMobile()

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={sizes => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`
      }}
      className="h-full items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        data-collapsed={isCollapsed}
        collapsible={true}
        minSize={isMobile ? navCollapsedSize : 5}
        maxSize={isMobile ? navCollapsedSize : 20}
        onCollapse={() => {
          setIsCollapsed(true)
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`
        }}
        onResize={() => {
          setIsCollapsed(false)
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`
        }}
        className={cx(
          "group/collapsible sticky top-0 h-dvh z-40 flex flex-col",
          isCollapsed ? "min-w-12 transition-all duration-300 ease-in-out" : "min-w-52 max-w-64",
        )}
      >
        <Nav>
          <NavMain
            isCollapsed={isCollapsed}
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
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Tools",
                href: "/admin/tools",
                label: stats[0].toLocaleString(),
                prefix: <GemIcon />,
              },
              {
                title: "Alternatives",
                href: "/admin/alternatives",
                label: stats[1].toLocaleString(),
                prefix: <ReplaceIcon />,
              },
              {
                title: "Categories",
                href: "/admin/categories",
                label: stats[2].toLocaleString(),
                prefix: <GalleryHorizontalEndIcon />,
              },
              {
                title: "Licenses",
                href: "/admin/licenses",
                label: stats[5].toLocaleString(),
                prefix: <CopyrightIcon />,
              },
            ]}
          />
        </Nav>

        <Nav className="mt-auto">
          <NavMain
            isCollapsed={isCollapsed}
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
      </ResizablePanel>

      <ResizableHandle
        withHandle={!isMobile}
        className="sticky top-0 h-dvh items-start pt-[1.33rem]"
      />

      <ResizablePanel
        defaultSize={defaultLayout[1]}
        className="grid grid-cols-1 content-start gap-4 p-4 sm:px-6"
      >
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
