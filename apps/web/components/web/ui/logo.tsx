import type { ComponentProps } from "react"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { LogoSymbol } from "~/components/web/ui/logo-symbol"
import { config } from "~/config"
import { cx } from "~/utils/cva"

export const Logo = ({ className, ...props }: ComponentProps<typeof Stack>) => {
  return (
    <Stack size="sm" className={cx("group/logo text-foreground", className)} asChild {...props}>
      <Link href="/">
        <LogoSymbol className="duration-300! ease-in-out! will-change-transform group-hover/logo:rotate-90" />

        <span className="font-medium text-sm">{config.site.name}</span>
      </Link>
    </Stack>
  )
}
