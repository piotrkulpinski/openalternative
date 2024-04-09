import { NavLink, NavLinkProps } from "@remix-run/react"
import { cva } from "cva"

export const navigationLinkVariants = cva({
  base: [
    "group flex items-center gap-2 p-0.5 -m-0.5 self-start text-sm -tracking-micro enabled:cursor-pointer",
    "text-neutral-500 disabled:opacity-50 enabled:hover:text-neutral-800 enabled:dark:hover:text-neutral-200",
  ],
  variants: {
    isActive: {
      true: "font-medium text-neutral-800 dark:text-neutral-200",
    },
  },
})

export const NavigationLink = ({ className, ...props }: NavLinkProps) => {
  return (
    <NavLink
      className={({ isActive }) => navigationLinkVariants({ isActive, className })}
      unstable_viewTransition
      {...props}
    />
  )
}
