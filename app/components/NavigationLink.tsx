import { NavLink, NavLinkProps } from "@remix-run/react"
import { cva } from "cva"

export const navigationLinkVariants = cva({
  base: [
    "-tracking-micro flex items-center gap-2 text-sm",
    "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
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
