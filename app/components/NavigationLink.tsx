import { NavLink, NavLinkProps } from "@remix-run/react"
import { cx } from "~/utils/cva"

export const NavigationLink = ({ className, ...props }: NavLinkProps) => {
  return (
    <NavLink
      className={({ isActive }) =>
        cx([
          "-tracking-micro flex items-center gap-2 text-sm",
          "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
          isActive && "font-medium text-neutral-800 dark:text-neutral-200",
          className,
        ])
      }
      unstable_viewTransition
      {...props}
    />
  )
}
