import type { ComponentProps } from "react"
import { Favicon } from "~/components/web/ui/favicon"
import { NavLink } from "~/components/web/ui/nav-link"

type BrandLinkProps = ComponentProps<typeof NavLink> & {
  name: string
  faviconUrl: string | null
}

export const BrandLink = ({ name, faviconUrl, ...props }: BrandLinkProps) => {
  return (
    <NavLink {...props}>
      <Favicon src={faviconUrl} title={name} className="size-6 p-[3px]" />

      <strong className="font-medium">{name}</strong>
    </NavLink>
  )
}
