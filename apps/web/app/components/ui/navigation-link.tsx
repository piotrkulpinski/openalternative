import { NavLink, type NavLinkProps } from "@remix-run/react"
import { type ElementRef, forwardRef } from "react"
import { cva, cx } from "~/utils/cva"

export const navigationLinkVariants = cva({
  base: [
    "group flex items-center gap-2 p-0.5 -m-0.5 text-sm cursor-pointer",
    "text-muted disabled:opacity-50 hover:text-foreground",
  ],
  variants: {
    isActive: {
      true: "font-medium text-foreground",
    },
  },
})

export const NavigationLink = forwardRef<ElementRef<typeof NavLink>, NavLinkProps>(
  ({ className, ...props }, ref) => {
    return (
      <NavLink
        ref={ref}
        className={({ isActive }) => cx(navigationLinkVariants({ isActive, className }))}
        unstable_viewTransition
        {...props}
      />
    )
  },
)

NavigationLink.displayName = "NavigationLink"
