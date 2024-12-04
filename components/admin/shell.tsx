import type { PropsWithChildren } from "react"
import { Sidebar } from "~/components/admin/sidebar"

export const Shell = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex items-stretch size-full">
      <Sidebar />

      <div className="grid grid-cols-1 content-start gap-4 p-4 flex-1 sm:px-6">{children}</div>
    </div>
  )
}
