import type { Metadata } from "next"
import { cookies } from "next/headers"
import type { PropsWithChildren } from "react"
import { CommandMenu } from "~/components/admin/command-menu"
import { Shell } from "~/components/admin/shell"
import { Toaster } from "~/components/common/toaster"
import { prisma } from "~/services/prisma"
import { Providers } from "./providers"

import "./styles.css"

export const metadata: Metadata = {
  title: "Admin Panel",
}

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const cookieStore = await cookies()

  const statsPromise = prisma.$transaction([
    prisma.tool.count(),
    prisma.alternative.count(),
    prisma.category.count(),
    prisma.language.count(),
    prisma.topic.count(),
    prisma.license.count(),
  ])

  const layout = cookieStore.get("react-resizable-panels:layout")
  const collapsed = cookieStore.get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined

  return (
    <Providers statsPromise={statsPromise}>
      <Shell defaultLayout={defaultLayout} defaultCollapsed={defaultCollapsed}>
        {children}
      </Shell>

      <CommandMenu />
      <Toaster />
    </Providers>
  )
}
