import { cookies } from "next/headers"
import type { PropsWithChildren } from "react"
import { Shell } from "~/app/(dashboard)/shell"
import { CommandMenu } from "~/components/command-menu"
import { prisma } from "~/services/prisma"
import { Providers } from "./providers"

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const statsPromise = Promise.all([
    prisma.tool.count(),
    prisma.alternative.count(),
    prisma.category.count(),
    prisma.language.count(),
    prisma.topic.count(),
    prisma.license.count(),
  ])

  const layout = cookies().get("react-resizable-panels:layout")
  const collapsed = cookies().get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined

  return (
    <Providers statsPromise={statsPromise}>
      <Shell defaultLayout={defaultLayout} defaultCollapsed={defaultCollapsed}>
        {children}
      </Shell>

      <CommandMenu />
    </Providers>
  )
}
