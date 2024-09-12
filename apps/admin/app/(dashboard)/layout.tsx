import { cookies } from "next/headers"
import type { PropsWithChildren } from "react"
import { Shell } from "~/app/(dashboard)/shell"
import { Providers } from "./providers"

export default function DashboardLayout({ children }: PropsWithChildren) {
  const layout = cookies().get("react-resizable-panels:layout:shell")
  const collapsed = cookies().get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined

  return (
    <Providers>
      <Shell defaultLayout={defaultLayout} defaultCollapsed={defaultCollapsed} navCollapsedSize={4}>
        {children}
      </Shell>
    </Providers>
  )
}
