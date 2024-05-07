import { Slot } from "@radix-ui/react-slot"
import { NavLink, type NavLinkProps } from "@remix-run/react"
import type { HTMLAttributes, ReactNode } from "react"
import { type VariantProps, cx } from "~/utils/cva"
import { navigationLinkVariants } from "./NavigationLink"

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
  return (
    <NavLink
      className={cx(
        "!gap-2",
        isDisabled && "pointer-events-none opacity-40",
        isActive && "bg-card-dark rounded-sm",
        navigationLinkVariants({
          isActive,
          className,
        }),
      )}
      unstable_viewTransition
      {...props}
    >
      <Slot className="size-5 duration-150 group-hover:-translate-x-0.5">{prefix}</Slot>

      {children}

      <Slot className="size-5 duration-150 group-hover:translate-x-0.5">{suffix}</Slot>
    </NavLink>
  )
}
