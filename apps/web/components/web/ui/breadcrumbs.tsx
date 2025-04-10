"use client"

import type { ComponentProps, ReactNode } from "react"
import type { Graph } from "schema-dts"
import { Icon } from "~/components/common/icon"
import { Stack } from "~/components/common/stack"
import { NavLink } from "~/components/web/ui/nav-link"
import { config } from "~/config"
import { cx } from "~/utils/cva"

const BreadcrumbsSeparator = ({ ...props }: ComponentProps<"span">) => {
  return (
    <span
      className="text-sm text-secondary-foreground invert pointer-events-none select-none"
      {...props}
    >
      /
    </span>
  )
}

type Breadcrumb = {
  href: string
  name: string | ReactNode
}

type BreadcrumbsProps = ComponentProps<typeof Stack> & {
  items: Breadcrumb[]
}

export const Breadcrumbs = ({ children, className, items, ...props }: BreadcrumbsProps) => {
  const breadcrumbItems = [
    {
      href: "/",
      name: <Icon name="lucide/house" aria-label="Home" />,
    },
    ...items,
  ]

  const jsonLd: Graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map(({ href, name }, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "WebPage",
            "@id": `${config.site.url}${href}`,
            name: typeof name === "string" ? name : config.site.name,
          },
        })),
      },
    ],
  }

  return (
    <Stack
      size="lg"
      className={cx("w-full justify-between -mb-2 md:-mb-6 lg:-mb-8", className)}
      {...props}
    >
      <Stack size="sm" asChild>
        <nav>
          {breadcrumbItems.map(({ href, name }, index) => (
            <div key={index} className="contents">
              {index > 0 && <BreadcrumbsSeparator />}
              <NavLink exact href={href}>
                {name}
              </NavLink>
            </div>
          ))}
        </nav>
      </Stack>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {children}
    </Stack>
  )
}
