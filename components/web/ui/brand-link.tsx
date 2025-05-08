import type { ComponentProps } from "react"
import { Stack } from "~/components/common/stack"
import { Favicon } from "~/components/web/ui/favicon"
import { NavLink } from "~/components/web/ui/nav-link"
import { cx } from "~/utils/cva"

type BrandLinkProps = ComponentProps<typeof NavLink> & {
  name: string
  faviconUrl: string | null
}

export const BrandLink = ({ children, className, name, faviconUrl, ...props }: BrandLinkProps) => {
  return (
    <NavLink className={cx("min-w-0 gap-[0.5em]", className)} {...props}>
      <Favicon src={faviconUrl} title={name} className="size-6 p-[3px] rounded-sm" />

      <Stack size="xs" className="min-w-0">
        <strong className="font-medium truncate">{name}</strong>
        {children && <span className="opacity-60">{children}</span>}
      </Stack>
    </NavLink>
  )
}
