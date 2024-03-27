import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { NavigationLink } from "./NavigationLink"

export const Navigation = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <nav
      className={cx("flex flex-col gap-3 md:gap-4 lg:flex-row lg:items-center", className)}
      {...props}
    >
      {/* <NavigationLink to="/categories">Categories</NavigationLink> */}
      <NavigationLink to="/alternatives">Alternatives</NavigationLink>
      <NavigationLink to="/about">About</NavigationLink>
      {/* <NavigationLink to="/about" className="relative">
        Support <Ping className="absolute -right-2.5 -top-1" />
      </NavigationLink> */}
    </nav>
  )
}
