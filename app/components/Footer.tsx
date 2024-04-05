import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { Series } from "./Series"
import { H6 } from "./Heading"
import { NavigationLink } from "./NavigationLink"
import { GITHUB_URL, SITE_EMAIL, TWITTER_URL } from "~/utils/constants"
import { GithubIcon, TwitterIcon } from "lucide-react"

export const Footer = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <footer className={cx("flex flex-col justify-between gap-4", className)} {...props}>
      <Series className="text-sm/normal text-neutral-500 md:gap-x-4">
        <H6>Explore:</H6>

        <NavigationLink to="/alternatives">Alternatives</NavigationLink>
        <NavigationLink to="/categories">Categories</NavigationLink>
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

        <NavigationLink to={TWITTER_URL} target="_blank" title="Twitter" rel="nofollow noreferrer">
          <TwitterIcon className="size-[1.44em]" />
        </NavigationLink>

        <NavigationLink to={GITHUB_URL} target="_blank" title="Source" rel="nofollow noreferrer">
          <GithubIcon className="size-[1.44em]" />
        </NavigationLink>
      </Series>

      {children}
    </footer>
  )
}
