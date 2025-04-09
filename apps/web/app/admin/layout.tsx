import type { Metadata } from "next"
import type { PropsWithChildren } from "react"
import { Shell } from "~/components/admin/shell"

export const metadata: Metadata = {
  title: "Admin Panel",
}

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <Shell>{children}</Shell>
}
