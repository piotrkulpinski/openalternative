import { GithubIcon, RssIcon, TwitterIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { GITHUB_URL, RSS_URL, SITE_EMAIL, TWITTER_URL } from "~/utils/constants"
import { cx } from "~/utils/cva"
import { H6 } from "./Heading"
import { NavigationLink } from "./NavigationLink"
import { Series } from "./Series"

export const Footer = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <footer
      className={cx("relative z-20 flex flex-col justify-between gap-4", className)}
      {...props}
    >
      <Series className="text-sm/normal md:gap-x-4">
        <H6 as="strong">Explore:</H6>

        <NavigationLink to="/alternatives">Alternatives</NavigationLink>
        <NavigationLink to="/categories">Categories</NavigationLink>
        <NavigationLink to="/languages">Languages</NavigationLink>
        <NavigationLink to="/topics">Topics</NavigationLink>
        <NavigationLink to="/licenses">Licenses</NavigationLink>

        <NavigationLink to="/sponsor" className="sm:ml-auto">
          Sponsor
        </NavigationLink>

        <NavigationLink to={`mailto:${SITE_EMAIL}`} target="_blank" rel="nofollow noreferrer">
          Contact
        </NavigationLink>

        <NavigationLink to={RSS_URL} target="_blank" title="Twitter" rel="nofollow noreferrer">
          <RssIcon className="size-[1.44em] stroke-[1.25]" />
        </NavigationLink>

        <NavigationLink to={TWITTER_URL} target="_blank" title="Twitter" rel="nofollow noreferrer">
          <TwitterIcon className="size-[1.44em] stroke-[1.25]" />
        </NavigationLink>

        <NavigationLink to={GITHUB_URL} target="_blank" title="Source" rel="nofollow noreferrer">
          <GithubIcon className="size-[1.44em] stroke-[1.25]" />
        </NavigationLink>
      </Series>

      {children}
    </footer>
  )
}
