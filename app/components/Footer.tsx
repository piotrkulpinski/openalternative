import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { Series } from "./Series"
import { H6 } from "./Heading"
import { GithubIcon } from "lucide-react"
import { NavigationLink } from "./NavigationLink"

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
          to="https://github.com/piotrkulpinski/openalternative"
          target="_blank"
          rel="nofollow noreferrer"
          className="flex items-center gap-1.5 sm:ml-auto"
        >
          <GithubIcon className="size-4 max-sm:hidden" /> Source
        </NavigationLink>
      </Series>

      {children}
    </footer>
  )
}
