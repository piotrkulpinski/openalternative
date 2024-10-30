import type { SerializeFrom } from "@remix-run/node"
import type { PropsWithChildren } from "react"
import { SponsoringCard } from "~/components/records/sponsoring-card"
import { RepositoryDetails } from "~/components/ui/repository-details"
import type { LanguageToToolMany, ToolOne } from "~/services.server/api"
import { HOSTING_SPONSOR } from "~/utils/constants"

type ToolSidebarProps = PropsWithChildren<{
  tool: SerializeFrom<ToolOne>
  languages: SerializeFrom<LanguageToToolMany[]>
}>

export const ToolSidebar = ({ children, tool, languages }: ToolSidebarProps) => {
  return (
    <>
      <RepositoryDetails tool={tool} languages={languages} />
      {HOSTING_SPONSOR && <SponsoringCard sponsoring={HOSTING_SPONSOR} />}
      {children}
    </>
  )
}
