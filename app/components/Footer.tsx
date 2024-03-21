import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { Link, LinkProps } from "@remix-run/react"
import { Series } from "./Series"
import { H6 } from "./Heading"
import { GithubIcon } from "lucide-react"

const FooterLink = ({ className, ...props }: LinkProps) => {
  return (
    <Link
      className={cx(
        "text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
        className
      )}
      {...props}
    />
  )
}

export const Footer = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <footer className={cx("flex flex-col justify-between gap-4", className)} {...props}>
      <Series className="text-sm/normal text-neutral-500 md:gap-x-4">
        <H6>Explore:</H6>

        <FooterLink to="/categories">Categories</FooterLink>
        <FooterLink to="/alternatives">Alternatives</FooterLink>
        <FooterLink to="/languages">Languages</FooterLink>
        <FooterLink to="/topics">Topics</FooterLink>

        <FooterLink
          to="https://github.com/piotrkulpinski/openalternative"
          target="_blank"
          rel="nofollow noreferrer"
          className="ml-auto flex items-center gap-1.5"
        >
          <GithubIcon className="size-4" /> Source
        </FooterLink>
      </Series>

      {children}
    </footer>
  )
}
