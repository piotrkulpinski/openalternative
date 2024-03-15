import { Heading, Series, cx } from "@curiousleaf/design"
import Link from "next/link"
import { HTMLAttributes } from "react"
import { config } from "~/config"
import { Logo } from "./Logo"

export const Footer = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const alternatives = [
    { name: "Notion", slug: "notion" },
    { name: "Salesforce", slug: "salesforce" },
    { name: "HubSpot", slug: "hubspot" },
    { name: "Typeform", slug: "typeform" },
    { name: "Calendly", slug: "calendly" },
  ]

  return (
    <div
      className={cx(
        "mt-auto flex flex-col justify-between gap-8 py-8 sm:flex-row md:gap-10",
        className,
      )}
      {...props}
    >
      <Series direction="column" size="lg">
        <Logo loading="lazy" />

        <div className="prose max-w-[50ch] leading-normal">
          <p>
            <strong>{config.title}</strong> is a community driven list of open source alternatives
            to proprietary software and applications.
          </p>
          <p>
            Our goal is to be your first stop when researching for a new open source service to help
            you grow your business. We will help you find alternatives and reviews of the products
            you already use.
          </p>
        </div>

        <Series className="mt-4 text-sm">
          <Link
            href="https://github.com/piotrkulpinski/openalternative"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Source Code
          </Link>
          <Link
            href="https://twitter.com/piotrkulpinski"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Twitter/X
          </Link>
        </Series>
      </Series>

      <Series direction="column" className="text-sm">
        <Heading size="h5" className="mb-2">
          Explore
        </Heading>

        <Link href="/about" prefetch={false}>
          About Us
        </Link>

        <Link href="/categories" prefetch={false}>
          Categories
        </Link>

        <Link href="/alternatives" prefetch={false}>
          Alternatives
        </Link>

        <Link href="/languages" prefetch={false}>
          Languages
        </Link>

        <Link href="/topics" prefetch={false}>
          Topics
        </Link>
      </Series>

      <Series direction="column" className="text-sm">
        <Heading size="h5" className="mb-2">
          Alternatives
        </Heading>

        {alternatives.map((alternative) => (
          <Link
            key={alternative.slug}
            href={`/alternatives-to/${alternative.slug}`}
            prefetch={false}
          >
            {alternative.name} Alternatives
          </Link>
        ))}
      </Series>
    </div>
  )
}
