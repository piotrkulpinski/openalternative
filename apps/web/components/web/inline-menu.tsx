"use client"

import type { ComponentProps } from "react"
import { Button, type ButtonProps } from "~/components/common/button"
import { Stack } from "~/components/common/stack"
import { type InlineMenuItem, useInlineMenu } from "~/hooks/use-inline-menu"
import { cx } from "~/utils/cva"

type InlineMenuProps = ComponentProps<typeof Stack> & {
  items: (InlineMenuItem & ButtonProps)[]
}

export const InlineMenu = ({ children, className, items, ...props }: InlineMenuProps) => {
  const activeId = useInlineMenu(items)

  return (
    <Stack
      size="xs"
      direction="column"
      wrap={false}
      className={cx("items-stretch overflow-y-auto overscroll-contain scroll-smooth", className)}
      asChild
      {...props}
    >
      <nav>
        {items.map(({ id, title, ...props }) => (
          <Button
            key={id}
            size="md"
            variant="ghost"
            className={cx(
              "hover:ring-transparent! focus-visible:ring-transparent",
              activeId === id
                ? "bg-accent text-foreground"
                : "text-muted-foreground font-normal hover:text-foreground",
            )}
            onClick={e => {
              e.preventDefault()
              document.querySelector(`#${id}`)?.scrollIntoView()
            }}
            {...props}
            asChild
          >
            <a href={`#${id}`}>{title}</a>
          </Button>
        ))}

        {children}
      </nav>
    </Stack>
  )
}
