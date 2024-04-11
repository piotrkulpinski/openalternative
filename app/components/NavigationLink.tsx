import { NavLink, NavLinkProps } from "@remix-run/react"
import { cva } from "cva"
import { ElementRef, forwardRef } from "react"

export const navigationLinkVariants = cva({
  base: [
    "group flex items-center gap-2 self-start p-0.5 -m-0.5 text-sm -tracking-micro cursor-pointer",
    "text-neutral-500 disabled:opacity-50 hover:text-neutral-800 dark:hover:text-neutral-200",
  ],
  variants: {
    isActive: {
      true: "font-medium text-neutral-800 dark:text-neutral-200",
    },
  },
})

export const NavigationLink = forwardRef<ElementRef<typeof NavLink>, NavLinkProps>(
  ({ className, ...props }, ref) => {
    return (
      <NavLink
        ref={ref}
        className={({ isActive }) => navigationLinkVariants({ isActive, className })}
        unstable_viewTransition
        {...props}
      />
    )
  }
)

NavigationLink.displayName = "NavigationLink"
