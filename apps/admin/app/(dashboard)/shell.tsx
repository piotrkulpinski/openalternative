"use client"

import {
  CopyrightIcon,
  GalleryHorizontalEndIcon,
  GemIcon,
  LayoutDashboardIcon,
  ReplaceIcon,
} from "lucide-react"
import * as React from "react"
import { Nav } from "~/app/(dashboard)/nav"
import { NavUser } from "~/app/(dashboard)/nav-user"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable"
import { Separator } from "~/components/ui/separator"
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
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Dashboard",
              icon: LayoutDashboardIcon,
              href: "/",
            },
          ]}
        />
        <Separator />
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Tools",
              href: "/tools",
              label: stats[0].toString(),
              icon: GemIcon,
            },
            {
              title: "Alternatives",
              href: "/alternatives",
              label: stats[1].toString(),
              icon: ReplaceIcon,
            },
            {
              title: "Categories",
              href: "/categories",
              label: stats[2].toString(),
              icon: GalleryHorizontalEndIcon,
            },
            {
              title: "Licenses",
              href: "/licenses",
              label: stats[5].toString(),
              icon: CopyrightIcon,
            },
          ]}
        />

        <NavUser isCollapsed={isCollapsed} className="mt-auto" />
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
