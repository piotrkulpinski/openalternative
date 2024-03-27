import { Slot } from "@radix-ui/react-slot"
import { NavLink, NavLinkProps } from "@remix-run/react"
import { HTMLAttributes, ReactNode } from "react"
import { navigationLinkVariants } from "./NavigationLink"

type PaginationLinkProps = Omit<HTMLAttributes<HTMLElement> & NavLinkProps, "prefix"> & {
  prefix?: ReactNode
  suffix?: ReactNode
  disabled?: boolean
}

export const PaginationLink = ({
  children,
  prefix,
  suffix,
  disabled,
  ...props
}: PaginationLinkProps) => {
  return (
    <NavLink
      className={navigationLinkVariants({
        className: disabled && "pointer-events-none opacity-40",
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
