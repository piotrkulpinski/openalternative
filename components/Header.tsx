"use client"

import { Series, cx } from "@curiousleaf/design"
import { HTMLAttributes } from "react"
import { Logo } from "./Logo"
import { config } from "~/config"
import { usePathname } from "next/navigation"
import Link from "next/link"

export const Header = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname()

  const links = [
    { href: "/categories", label: "Categories" },
    { href: "/alternatives", label: "Alternatives" },
    {
      href: "https://airtable.com/appcN6nvv5n1GpABK/pagzZyGl6fEI2RWDq/form",
      label: "+ Submit",
      target: "_blank",
    },
  ]

  return (
    <nav
      className={cx("flex w-full min-w-0 items-center gap-3 pt-3 md:pt-4", className)}
      {...props}
    >
      {pathname === "/" ? (
        <h1>
          <Logo>{config.title}</Logo>
        </h1>
      ) : (
        <Logo>{config.title}</Logo>
      )}

      <Series size="lg" className="ml-auto text-sm text-gray-600 max-sm:hidden">
        {links.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            target={link.target}
            className={cx("hover:text-black", pathname.includes(link.href) && "font-semibold")}
          >
            {link.label}
          </Link>
        ))}
      </Series>
    </nav>
  )
}
