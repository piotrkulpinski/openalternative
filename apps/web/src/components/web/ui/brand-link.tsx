import type { ComponentProps } from "react"
import { Stack } from "~/components/common/stack"
import { Favicon } from "~/components/web/ui/favicon"
import { NavLink } from "~/components/web/ui/nav-link"

type BrandLinkProps = ComponentProps<typeof NavLink> & {
  name: string
  faviconUrl: string | null
}

export const BrandLink = ({ children, name, faviconUrl, ...props }: BrandLinkProps) => {
  return (
    <NavLink {...props}>
      <Favicon src={faviconUrl} title={name} className="size-6 p-[3px]" />

      <Stack size="xs">
        <strong className="font-medium">{name}</strong>
        {children && <span className="opacity-60">{children}</span>}
      </Stack>
    </NavLink>
  )
}
