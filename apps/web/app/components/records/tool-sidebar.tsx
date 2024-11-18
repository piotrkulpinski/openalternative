import type { SerializeFrom } from "@remix-run/node"
import type { PropsWithChildren } from "react"
import { AdvertiseCard } from "~/components/records/advertise-card"
import { RepositoryDetails } from "~/components/ui/repository-details"
import type { LanguageToToolMany, SponsoringOne, ToolOne } from "~/services.server/api"

type ToolSidebarProps = PropsWithChildren<{
  tool: SerializeFrom<ToolOne>
  languages: SerializeFrom<LanguageToToolMany[]>
  sponsoring: SerializeFrom<SponsoringOne> | null
}>

export const ToolSidebar = ({ children, tool, languages, sponsoring }: ToolSidebarProps) => {
  return (
    <>
      <RepositoryDetails tool={tool} languages={languages} />
      <AdvertiseCard sponsoring={sponsoring} />
      {children}
    </>
  )
}
