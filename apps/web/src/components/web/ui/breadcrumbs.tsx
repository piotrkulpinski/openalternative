"use client"

import { Home } from "lucide-react"
import type { ComponentProps, HTMLAttributes } from "react"
import { Stack } from "~/components/common/stack"
import { NavLink } from "~/components/web/ui/nav-link"
import { cx } from "~/utils/cva"

const BreadcrumbsSeparator = ({ ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <span className="text-sm text-secondary invert pointer-events-none select-none" {...props}>
      /
    </span>
  )
}

type BreadcrumbsProps = HTMLAttributes<HTMLElement> & {
  items: ComponentProps<typeof NavLink>[]
}

export const Breadcrumbs = ({ className, items, ...props }: BreadcrumbsProps) => {
  const defaultItems: ComponentProps<typeof NavLink>[] = [
    {
      href: "/",
      children: <Home aria-label="Home" />,
    },
  ]

  return (
    <Stack size="sm" asChild>
      <nav
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className={cx("-mb-4 md:-mb-6 lg:-mb-8", className)}
        {...props}
      >
        {[...defaultItems, ...items].map((item, i) => (
          <div
            key={i}
            className="contents"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {i > 0 && (
              <span className="text-sm text-secondary invert pointer-events-none select-none">
                /
              </span>
            )}

            <NavLink itemProp="item" exact {...item} />

            <meta itemProp="position" content={`${i + 1}`} />
          </div>
        ))}
      </nav>
    </Stack>
  )
}
