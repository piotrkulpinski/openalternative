import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { Prose } from "./Prose"
import { Series } from "./Series"
import { Link, LinkProps } from "@remix-run/react"
import { H6 } from "./Heading"

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
  const alternatives = [
    { name: "Notion", slug: "notion" },
    { name: "Salesforce", slug: "salesforce" },
    { name: "HubSpot", slug: "hubspot" },
    { name: "Typeform", slug: "typeform" },
    { name: "Calendly", slug: "calendly" },
  ]

  return (
    <footer
      className={cx("flex flex-col justify-between gap-8 sm:flex-row md:gap-10", className)}
      {...props}
    >
      <Prose className="max-w-[50ch] text-sm/normal text-neutral-500">
        <p>
          OpenAlternative is a community driven list of open source alternatives to proprietary
          software and applications.
        </p>

        <p>
          Our goal is to be your first stop when researching for a new open source service to help
          you grow your business. We will help you find alternatives and reviews of the products you
          already use.
        </p>
        <p>
          © {new Date().getFullYear()} &middot;{" "}
          <a
            href="https://github.com/piotrkulpinski/openalternative"
            target="_blank"
            rel="nofollow noreferrer"
          >
            Source
          </a>
        </p>
      </Prose>

      <Series direction="column" className="gap-1.5">
        <H6 className="mb-2">Explore</H6>

        <FooterLink to="/about">About Us</FooterLink>
        <FooterLink to="/categories">Categories</FooterLink>
        <FooterLink to="/alternatives">Alternatives</FooterLink>
        <FooterLink to="/languages">Languages</FooterLink>
        <FooterLink to="/topics">Topics</FooterLink>
      </Series>

      <Series direction="column" className="gap-1.5">
        <H6 className="mb-2">Alternatives</H6>

        {alternatives.map((alternative) => (
          <FooterLink key={alternative.slug} to={`/alternatives-to/${alternative.slug}`}>
            {alternative.name} Alternatives
          </FooterLink>
        ))}
      </Series>

      {children}
    </footer>
  )
}
