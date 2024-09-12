"use client"

import { ArchiveX, File, Inbox, Send, Settings } from "lucide-react"
import * as React from "react"
import { Nav } from "~/app/(dashboard)/nav"
import { NavUser } from "~/app/(dashboard)/nav-user"
import { Logo } from "~/components/ui/logo"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable"
import { Separator } from "~/components/ui/separator"
import { useIsMobile } from "~/hooks/use-mobile"
import { cx } from "~/utils/cva"

interface ShellProps extends React.PropsWithChildren {
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

export function Shell({
  children,
  defaultLayout = [20, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: ShellProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const isMobile = useIsMobile()

  // React.useEffect(() => {
  //   if (isMobile) {
  //     setIsCollapsed(true)
  //     document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`
  //   }
  // }, [isMobile])

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={sizes => {
        document.cookie = `react-resizable-panels:layout:shell=${JSON.stringify(sizes)}`
      }}
      className="h-full items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        data-collapsed={isCollapsed}
        collapsible={true}
        minSize={isMobile ? navCollapsedSize : 15}
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
          isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out",
        )}
      >
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Dashboard",
              icon: Logo,
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
              label: "324",
              icon: Inbox,
            },
            {
              title: "Alternatives",
              href: "/alternatives",
              label: "9",
              icon: File,
            },
            {
              title: "Categories",
              href: "/categories",
              label: "41",
              icon: Send,
            },
            {
              title: "Licenses",
              href: "/licenses",
              label: "23",
              icon: ArchiveX,
            },
          ]}
        />
        <Separator />
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Settings",
              href: "/settings",
              icon: Settings,
            },
          ]}
        />

        <NavUser isCollapsed={isCollapsed} className="mt-auto" />
        <ResizableHandle withHandle={!isMobile} className="absolute inset-y-0 right-0 z-30" />
      </ResizablePanel>

      <ResizablePanel
        defaultSize={defaultLayout[1]}
        minSize={30}
        className="grid grid-cols-1 content-start gap-4 p-4 sm:px-6"
      >
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
