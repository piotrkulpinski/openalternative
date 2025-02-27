"use client"

import { usePathname } from "next/navigation"
import type { ComponentProps, ReactNode } from "react"
import { Badge } from "~/components/common/badge"
import { Button, type ButtonProps } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { Tooltip, TooltipProvider } from "~/components/common/tooltip"
import { cx } from "~/utils/cva"

type NavMainLink = ButtonProps & {
  title: string
  href: string
  label?: ReactNode
}

type NavMainProps = ComponentProps<"nav"> & {
  isCollapsed: boolean
  links: NavMainLink[]
}

export const NavMain = ({ className, links, isCollapsed, ...props }: NavMainProps) => {
  const pathname = usePathname()
  const rootPath = "/admin"

  const isActive = (href: string) => {
    if (
      (href === rootPath && href === pathname) ||
      (href !== rootPath && pathname.startsWith(href))
    ) {
      return true
    }

    return false
  }

  return (
    <TooltipProvider delayDuration={250}>
      {links.map(({ href, title, label, ...props }, index) =>
        isCollapsed ? (
          <Tooltip
            key={index}
            side="right"
            tooltip={
              <Stack size="lg">
                {title}
                {label && <span className="opacity-60">{label}</span>}
              </Stack>
            }
          >
            <Button
              size="md"
              variant="ghost"
              aria-label={title}
              className={cx(isActive(href) && "bg-accent text-foreground")}
              hover={false}
              asChild
              {...props}
            >
              <Link href={href} />
            </Button>
          </Tooltip>
        ) : (
          <Button
            key={index}
            size="md"
            variant="ghost"
            suffix={
              label && (
                <Badge variant="outline" className="ml-auto size-auto">
                  {label}
                </Badge>
              )
            }
            className={cx("justify-start", isActive(href) && "bg-accent text-foreground")}
            hover={false}
            asChild
            {...props}
          >
            <Link href={href}>{title}</Link>
          </Button>
        ),
      )}
    </TooltipProvider>
  )
}
