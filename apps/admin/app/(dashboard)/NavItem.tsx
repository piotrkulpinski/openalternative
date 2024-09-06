"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/Tooltip"
import { cx } from "~/utils/cva"

export function NavItem({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cx(
            "flex size-8 items-center justify-center rounded-lg",
            pathname === href
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {children}
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}
