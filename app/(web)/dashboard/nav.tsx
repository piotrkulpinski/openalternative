"use client"

import { usePathname } from "next/navigation"
import type { ComponentProps } from "react"
import { Box } from "~/components/common/box"
import { Link } from "~/components/common/link"
import { cx } from "~/utils/cva"

const isItemActive = (href: string | undefined, pathname: string, exact = false) => {
  if (href && href !== "/") {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return false
}

export const DashboardNav = ({ className, ...props }: ComponentProps<"div">) => {
  const pathname = usePathname()

  const items = [
    {
      label: "Submitted",
      href: "/dashboard/submitted",
    },
    {
      label: "Claimed",
      href: "/dashboard/claimed",
    },
  ]

  return (
    <div
      className={cx(
        "flex items-center justify-center self-start rounded-lg bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    >
      {items.map(item => (
        <Box key={item.href} focus>
          <Link
            key={item.href}
            href={item.href}
            className={cx(
              "whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium",
              isItemActive(item.href, pathname)
                ? "bg-background text-foreground"
                : "border-transparent hover:text-secondary-foreground",
            )}
          >
            {item.label}
          </Link>
        </Box>
      ))}
    </div>
  )
}
