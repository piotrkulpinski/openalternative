"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentProps } from "react"
import { cva, cx } from "~/utils/cva"

const navLinkVariants = cva({
  base: [
    "group flex items-center gap-2 p-0.5 -m-0.5 text-sm cursor-pointer",
    "text-muted disabled:opacity-50 hover:text-foreground",
  ],
  variants: {
    isActive: {
      true: "font-medium text-foreground",
    },
  },
})

const isItemActive = (href: string | undefined, pathname: string) => {
  if (href && href !== "/") {
    return pathname.includes(href)
  }

  return false
}

const NavLink = ({ className, ...props }: ComponentProps<"a"> & ComponentProps<typeof Link>) => {
  const pathname = usePathname()
  const isActive = isItemActive(props.href, pathname)

  return (
    <Link prefetch={false} className={cx(navLinkVariants({ isActive, className }))} {...props} />
  )
}

export { NavLink, navLinkVariants }
