"use client"

import { Slot } from "@radix-ui/react-slot"
import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"
import { navigationLinkVariants } from "~/components/web/ui/navigation-link"
import { type VariantProps, cva, cx } from "~/utils/cva"

const affixVariants = cva({
  base: "size-5 duration-150 group-hover:first:-translate-x-0.5 group-hover:last:translate-x-0.5",
})

type PaginationLinkProps = Omit<ComponentProps<"a"> & ComponentProps<typeof Link>, "prefix"> &
  VariantProps<typeof navigationLinkVariants> & {
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
      <span className={cx(navigationLinkVariants({ className: "pointer-events-none opacity-40" }))}>
        <Slot className={affixVariants()}>{prefix}</Slot>
        <span>{children}</span>
        <Slot className={affixVariants()}>{suffix}</Slot>
      </span>
    )
  }

  return (
    <Link
      className={cx(
        isActive && "bg-card-dark rounded-sm",
        navigationLinkVariants({ isActive, className }),
      )}
      {...props}
    >
      <Slot className={affixVariants()}>{prefix}</Slot>
      <span>{children}</span>
      <Slot className={affixVariants()}>{suffix}</Slot>
    </Link>
  )
}
