import { NavLink, useLocation } from "@remix-run/react"
import { cx } from "cva"
import { HTMLAttributes } from "react"

export const Navigation = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const { pathname } = useLocation()

  return (
    <nav
      className={cx(
        "flex items-center gap-3 text-neutral-600 md:gap-4 dark:text-neutral-400",
        className
      )}
      {...props}
    >
      <NavLink
        to="/categories"
        className={cx([
          "text-sm hover:text-neutral-700 dark:hover:text-neutral-300",
          pathname === "categories" && "text-black underline dark:text-neutral-200",
        ])}
      >
        Categories
      </NavLink>

      <NavLink
        to="/alternatives"
        className={cx([
          "text-sm hover:text-neutral-700 dark:hover:text-neutral-300",
          pathname === "alternatives" && "text-black underline dark:text-neutral-200",
        ])}
      >
        Alternatives
      </NavLink>

      <NavLink
        to="/about"
        className={cx([
          "text-sm hover:text-neutral-700 dark:hover:text-neutral-300",
          pathname === "about" && "text-black underline dark:text-neutral-200",
        ])}
      >
        About
      </NavLink>
    </nav>
  )
}
