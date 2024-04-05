import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { NavigationLink } from "./NavigationLink"

type NavigationProps = HTMLAttributes<HTMLElement> & {
  /*
   * Show all links, including those that are not in the navigation bar.
   */
  showAllLinks?: boolean
}

export const Navigation = ({ className, showAllLinks, ...props }: NavigationProps) => {
  return (
    <nav
      className={cx("flex flex-col gap-y-2 gap-x-4 lg:flex-row lg:items-center", className)}
      {...props}
    >
      <NavigationLink to="/alternatives">Alternatives</NavigationLink>

      {showAllLinks && (
        <>
          <NavigationLink to="/categories">Categories</NavigationLink>
          <NavigationLink to="/languages">Languages</NavigationLink>
          <NavigationLink to="/topics">Topics</NavigationLink>
          <NavigationLink to="/submit">Submit</NavigationLink>
        </>
      )}

      <NavigationLink to="/about">About</NavigationLink>
      {/* <NavigationLink to="/about" className="relative">
        Support <Ping className="absolute -right-2.5 -top-1" />
      </NavigationLink> */}
    </nav>
  )
}
