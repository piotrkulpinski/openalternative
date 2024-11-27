"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentProps, ReactNode } from "react"
import { Badge } from "~/components/admin/ui/badge"
import { Button, type ButtonProps } from "~/components/admin/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/admin/ui/tooltip"

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

  const getButtonVariant = (href: string) => {
    if (
      (href === rootPath && href === pathname) ||
      (href !== rootPath && pathname.startsWith(href))
    ) {
      return "secondary"
    }

    return "ghost"
  }

  return (
    <>
      {links.map(({ href, title, label, ...props }, index) =>
        isCollapsed ? (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={getButtonVariant(href)}
                aria-label={title}
                asChild
                {...props}
              >
                <Link href={href} />
              </Button>
            </TooltipTrigger>

            <TooltipContent side="right" className="flex items-center gap-4">
              {title}
              {label && <span className="opacity-60">{label}</span>}
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            key={index}
            variant={getButtonVariant(href)}
            suffix={
              label && (
                <Badge variant="outline" className="ml-auto px-1.5 size-auto">
                  {label}
                </Badge>
              )
            }
            className="justify-start"
            asChild
            {...props}
          >
            <Link href={href}>{title}</Link>
          </Button>
        ),
      )}
    </>
  )
}
