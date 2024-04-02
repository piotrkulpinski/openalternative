import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { Series } from "./Series"
import { H6 } from "./Heading"
import { NavigationLink } from "./NavigationLink"
import { SITE_EMAIL } from "~/utils/constants"

export const Footer = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <footer className={cx("flex flex-col justify-between gap-4", className)} {...props}>
      <Series className="text-sm/normal text-neutral-500 md:gap-x-4">
        <H6>Explore:</H6>

        <NavigationLink to="/categories">Categories</NavigationLink>
        <NavigationLink to="/alternatives">Alternatives</NavigationLink>
        <NavigationLink to="/languages">Languages</NavigationLink>
        <NavigationLink to="/topics">Topics</NavigationLink>

        <NavigationLink
          to={`mailto:${SITE_EMAIL}`}
          target="_blank"
          rel="nofollow noreferrer"
          className="sm:ml-auto"
        >
          Contact
        </NavigationLink>
        <NavigationLink
          to="https://github.com/piotrkulpinski/openalternative"
          target="_blank"
          rel="nofollow noreferrer"
        >
          Source Code
        </NavigationLink>
      </Series>

      {children}
    </footer>
  )
}
