import type { Metadata } from "next"
import type { PropsWithChildren } from "react"
import { CommandMenu } from "~/components/admin/command-menu"
import { Shell } from "~/components/admin/shell"
import { Toaster } from "~/components/common/toaster"

export const metadata: Metadata = {
  title: "Admin Panel",
}

export default async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Shell>{children}</Shell>

      <CommandMenu />
      <Toaster />
    </>
  )
}
