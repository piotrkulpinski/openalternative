import { NavLink, NavLinkProps } from "@remix-run/react"
import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

const NavigationLink = ({ className, ...props }: NavLinkProps) => {
  return (
    <NavLink
      className={({ isActive }) =>
        cx([
          "text-sm text-neutral-600 hover:text-neutral-800",
          "dark:text-neutral-400 dark:hover:text-neutral-200",
          isActive && "text-neutral-800 underline dark:text-neutral-200",
          className,
        ])
      }
      {...props}
    />
  )
}

export const Navigation = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <nav
      className={cx("flex flex-col gap-3 md:gap-4 lg:flex-row lg:items-center", className)}
      {...props}
    >
      <NavigationLink to="/categories">Categories</NavigationLink>
      <NavigationLink to="/alternatives">Alternatives</NavigationLink>
      <NavigationLink to="/about">About</NavigationLink>
      {/* <NavigationLink to="/about" className="relative">
        Support <Ping className="absolute -right-2.5 -top-1" />
      </NavigationLink> */}
    </nav>
  )
}
