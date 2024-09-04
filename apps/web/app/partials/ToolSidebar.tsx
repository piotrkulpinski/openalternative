import type { SerializeFrom } from "@remix-run/node"
import { RepositoryDetails } from "apps/web/app/components/RepositoryDetails"
import { SponsoringCard } from "apps/web/app/partials/records/SponsoringCard"
import type { LanguageToToolMany, ToolOne } from "apps/web/app/services.server/api"
import { HOSTING_SPONSOR } from "apps/web/app/utils/constants"
import { cx } from "apps/web/app/utils/cva"
import type { HTMLAttributes } from "react"

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
