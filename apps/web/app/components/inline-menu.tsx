import type { ComponentProps } from "react"
import { Button, type ButtonProps } from "~/components/ui/button"
import { Stack } from "~/components/ui/stack"
import { type InlineMenuItem, useInlineMenu } from "~/hooks/use-inline-menu"
import { cx } from "~/utils/cva"

type MenuItem = InlineMenuItem & ButtonProps

type InlineMenuProps = ComponentProps<typeof Stack> & {
  items: MenuItem[]
}

export const InlineMenu = ({ children, className, items, ...props }: InlineMenuProps) => {
  const activeId = useInlineMenu(items)

  return (
    <Stack
      size="xs"
      direction="column"
      className={cx("items-stretch overflow-y-auto overscroll-contain scroll-smooth", className)}
      asChild
      {...props}
    >
      <nav>
        {items.map(({ id, title, ...props }) => (
          <Button
            key={id}
            variant="ghost"
            className={cx(
              "!ring-0",
              activeId === id
                ? "bg-card-dark text-foreground"
                : "text-muted font-normal hover:text-foreground",
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
