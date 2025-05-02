"use client"

import { Slot } from "radix-ui"
import type { ComponentProps, ReactNode } from "react"
import { Link } from "~/components/common/link"
import { navLinkVariants } from "~/components/web/ui/nav-link"
import { type VariantProps, cva, cx } from "~/utils/cva"

const affixVariants = cva({
  base: "size-4 duration-150 first:group-hover:-translate-x-0.5 last:group-hover:translate-x-0.5",
})

type PaginationLinkProps = Omit<ComponentProps<"a"> & ComponentProps<typeof Link>, "prefix"> &
  VariantProps<typeof navLinkVariants> & {
    prefix?: ReactNode
    suffix?: ReactNode
    isDisabled?: boolean
  }

export const PaginationLink = ({
  children,
  className,
  prefix,
  suffix,
  isActive,
  isDisabled,
  ...props
}: PaginationLinkProps) => {
  if (isDisabled) {
    return (
      <span className={cx(navLinkVariants({ className: "pointer-events-none invisible" }))}>
        <Slot.Root className={affixVariants()}>{prefix}</Slot.Root>
        <span>{children}</span>
        <Slot.Root className={affixVariants()}>{suffix}</Slot.Root>
      </span>
    )
  }

  return (
    <Link
      className={cx(isActive && "bg-accent rounded-md", navLinkVariants({ isActive, className }))}
      {...props}
    >
      <Slot.Root className={affixVariants()}>{prefix}</Slot.Root>
      <span>{children}</span>
      <Slot.Root className={affixVariants()}>{suffix}</Slot.Root>
    </Link>
  )
}
