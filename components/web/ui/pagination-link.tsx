import { Slot } from "@radix-ui/react-slot"
import { NavLink, type NavLinkProps } from "@remix-run/react"
import type { HTMLAttributes, ReactNode } from "react"
import { navigationLinkVariants } from "~/components/ui/navigation-link"
import { type VariantProps, cva, cx } from "~/utils/cva"

const affixVariants = cva({
  base: "size-5 duration-150 group-hover:first:-translate-x-0.5 group-hover:last:translate-x-0.5",
})

type PaginationLinkProps = Omit<HTMLAttributes<HTMLElement> & NavLinkProps, "prefix"> &
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
    <NavLink
      className={cx(
        isActive && "bg-card-dark rounded-sm",
        navigationLinkVariants({ isActive, className }),
      )}
      unstable_viewTransition
      {...props}
    >
      <Slot className={affixVariants()}>{prefix}</Slot>
      <span>{children}</span>
      <Slot className={affixVariants()}>{suffix}</Slot>
    </NavLink>
  )
}
