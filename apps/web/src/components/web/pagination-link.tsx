"use client"

import { Slot } from "@radix-ui/react-slot"
import type { ComponentProps, ReactNode } from "react"
import { Link } from "~/components/common/link"
import { navLinkVariants } from "~/components/web/ui/nav-link"
import { type VariantProps, cva, cx } from "~/utils/cva"

const affixVariants = cva({
  base: "size-5 duration-150 first:group-hover:-translate-x-0.5 last:group-hover:translate-x-0.5",
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
      <span className={cx(navLinkVariants({ className: "pointer-events-none opacity-40" }))}>
        <Slot className={affixVariants()}>{prefix}</Slot>
        <span>{children}</span>
        <Slot className={affixVariants()}>{suffix}</Slot>
      </span>
    )
  }

  return (
    <Link
      className={cx(isActive && "bg-accent rounded-xs", navLinkVariants({ isActive, className }))}
      {...props}
    >
      <Slot className={affixVariants()}>{prefix}</Slot>
      <span>{children}</span>
      <Slot className={affixVariants()}>{suffix}</Slot>
    </Link>
  )
}
