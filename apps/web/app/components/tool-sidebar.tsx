import type { SerializeFrom } from "@remix-run/node"
import type { HTMLAttributes } from "react"
import { SponsoringCard } from "~/components/records/sponsoring-card"
import { RepositoryDetails } from "~/components/ui/repository-details"
import type { LanguageToToolMany, ToolOne } from "~/services.server/api"
import { HOSTING_SPONSOR } from "~/utils/constants"
import { cx } from "~/utils/cva"

type ToolSidebarProps = HTMLAttributes<HTMLDivElement> & {
  tool: SerializeFrom<ToolOne>
  languages: SerializeFrom<LanguageToToolMany[]>
}

export const ToolSidebar = ({
  children,
  className,
  tool,
  languages,
  ...props
}: ToolSidebarProps) => {
  return (
    <div className={cx("flex flex-col gap-6 md:gap-4", className)} {...props}>
      <RepositoryDetails tool={tool} languages={languages} />
      <SponsoringCard sponsoring={HOSTING_SPONSOR} />
      {children}
    </div>
  )
}
