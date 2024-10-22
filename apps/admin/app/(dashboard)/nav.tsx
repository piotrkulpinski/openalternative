"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentProps } from "react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { cx } from "~/utils/cva"

interface NavProps extends ComponentProps<"nav"> {
  isCollapsed: boolean
  links: {
    title: string
    href: string
    label?: string
    icon: React.ElementType
  }[]
}

export function Nav({ className, links, isCollapsed, ...props }: NavProps) {
  const pathname = usePathname()

  const getButtonVariant = (href: string) => {
    if (href === "/") {
      if (href === pathname) {
        return "secondary"
      }
    } else {
      if (pathname.startsWith(href)) {
        return "secondary"
      }
    }
    return "ghost"
  }

  return (
    <nav
      className={cx(
        "flex flex-col gap-1 p-3 group-data-[collapsed=true]/collapsible:justify-center group-data-[collapsed=true]/collapsible:px-2",
        className,
      )}
      {...props}
    >
      {links.map((link, index) =>
        isCollapsed ? (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={getButtonVariant(link.href)}
                prefix={<link.icon />}
                aria-label={link.title}
                asChild
              >
                <Link href={link.href} />
              </Button>
            </TooltipTrigger>

            <TooltipContent side="right" className="flex items-center gap-4">
              {link.title}
              {link.label && <span className="opacity-60">{link.label}</span>}
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            key={index}
            variant={getButtonVariant(link.href)}
            prefix={<link.icon />}
            suffix={
              link.label && (
                <Badge variant="outline" className="ml-auto px-1.5 size-auto">
                  {link.label}
                </Badge>
              )
            }
            className="justify-start"
            asChild
          >
            <Link href={link.href}>{link.title}</Link>
          </Button>
        ),
      )}
    </nav>
  )
}
