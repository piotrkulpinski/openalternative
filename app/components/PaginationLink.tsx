import { Slot } from "@radix-ui/react-slot"
import { NavLink, NavLinkProps } from "@remix-run/react"
import { HTMLAttributes, ReactNode } from "react"
import { navigationLinkVariants } from "./NavigationLink"
import { VariantProps } from "~/utils/cva"

type PaginationLinkProps = Omit<HTMLAttributes<HTMLElement> & NavLinkProps, "prefix"> &
  VariantProps<typeof navigationLinkVariants> & {
    prefix?: ReactNode
    suffix?: ReactNode
    isDisabled?: boolean
  }

export const PaginationLink = ({
  children,
  prefix,
  suffix,
  isActive,
  isDisabled,
  ...props
}: PaginationLinkProps) => {
  return (
    <NavLink
      className={navigationLinkVariants({
        isActive,
        className: isDisabled && "pointer-events-none opacity-40",
      })}
      unstable_viewTransition
      {...props}
    >
      <Slot className="size-5 duration-150 group-hover:-translate-x-0.5 group-hover:scale-105">
        {prefix}
      </Slot>
      {children}
      <Slot className="size-5 duration-150 group-hover:translate-x-0.5 group-hover:scale-105">
        {suffix}
      </Slot>
    </NavLink>
  )
}
