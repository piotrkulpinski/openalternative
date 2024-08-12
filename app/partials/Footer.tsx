import { slugify } from "@curiousleaf/utils"
import type { SerializeFrom } from "@remix-run/node"
import { AtSignIcon, RssIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { H6 } from "~/components/Heading"
import { NavigationLink } from "~/components/NavigationLink"
import { Series } from "~/components/Series"
import { BrandGitHubIcon } from "~/components/icons/BrandGitHub"
import { BrandXIcon } from "~/components/icons/BrandX"
import type { CategoryMany } from "~/services.server/api"
import {
  CLIMATE_URL,
  GITHUB_URL,
  RSS_URL,
  SITE_EMAIL,
  TWITTER_AUTHOR_URL,
  TWITTER_URL,
} from "~/utils/constants"
import { cx } from "~/utils/cva"
import { Newsletter } from "./Newsletter"

type FooterProps = HTMLAttributes<HTMLElement> & {
  categories?: SerializeFrom<CategoryMany>[]
}

export const Footer = ({ children, className, categories, ...props }: FooterProps) => {
  const alternatives = [
    "Notion",
    "Obsidian",
    "Airtable",
    "Framer",
    "Mixpanel",
    "PlanetScale",
    "Zapier",
    "Retool",
  ]

  return (
    <footer
      className={cx(
        "grid gap-y-8 gap-x-6 md:grid-cols-9 lg:grid-cols-[repeat(16,minmax(0,1fr))]",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-start gap-4 col-span-full lg:col-span-6">
        <Newsletter
          title="Newsletter"
          description="Get updates on new tools, alternatives, and other cool stuff."
        />

        <Series className="text-sm/normal">
          <NavigationLink to={RSS_URL} target="_blank" title="RSS Feed" rel="nofollow noreferrer">
            <RssIcon className="size-[1.44em] stroke-[1.25]" />
          </NavigationLink>

          <NavigationLink
            to={`mailto:${SITE_EMAIL}`}
            target="_blank"
            title="Contact Us"
            rel="nofollow noreferrer"
          >
            <AtSignIcon className="size-[1.44em] stroke-[1.25]" />
          </NavigationLink>

          <NavigationLink
            to={TWITTER_URL}
            target="_blank"
            title="Twitter"
            rel="nofollow noreferrer"
          >
            <BrandXIcon className="size-[1.44em] stroke-[1.25]" />
          </NavigationLink>

          <NavigationLink to={GITHUB_URL} target="_blank" title="Source" rel="nofollow noreferrer">
            <BrandGitHubIcon className="size-[1.44em] stroke-[1.25]" />
          </NavigationLink>
        </Series>

        <NavigationLink to={TWITTER_AUTHOR_URL} className="mt-auto text-xs">
          <img
            src="/users/1.jpg"
            alt="Piotr Kulpinski"
            loading="lazy"
            width="16"
            height="16"
            decoding="async"
            className="size-4"
          />
          Made by Piotr Kulpinski
        </NavigationLink>

        <NavigationLink to={CLIMATE_URL} target="_blank" className="-mt-2 text-xs">
          <img
            src="/stripe-climate-badge.svg"
            alt="Stripe Climate Badge"
            loading="lazy"
            width="16"
            height="16"
            decoding="async"
            className="size-4"
          />
          We contribute 1% of our revenue to carbon removal
        </NavigationLink>
      </div>

      <Series className="gap-x-4 text-sm/normal md:flex-col md:items-start md:col-span-3 lg:col-start-8">
        <H6 as="strong">Explore:</H6>

        <NavigationLink to="/alternatives">Alternatives</NavigationLink>
        <NavigationLink to="/categories">Categories</NavigationLink>
        <NavigationLink to="/languages">Languages</NavigationLink>
        <NavigationLink to="/topics">Topics</NavigationLink>
        <NavigationLink to="/licenses">Licenses</NavigationLink>
        <NavigationLink to="/sponsor">Sponsor</NavigationLink>
        <NavigationLink to="/submit">Submit</NavigationLink>
      </Series>

      {!!categories?.length && (
        <Series className="gap-x-4 text-sm/normal md:flex-col md:items-start md:col-span-3">
          <H6 as="strong">Top Categories:</H6>

          {categories.map(category => (
            <NavigationLink key={category.id} to={`/categories/${category.slug}`}>
              {category.label}
            </NavigationLink>
          ))}

          <NavigationLink to="/categories" end>
            All Categories
          </NavigationLink>
        </Series>
      )}

      {!!alternatives?.length && (
        <Series className="gap-x-4 text-sm/normal md:flex-col md:items-start md:col-span-3">
          <H6 as="strong">Top Alternatives:</H6>

          {alternatives.map(alternative => (
            <NavigationLink key={alternative} to={`/alternatives/${slugify(alternative)}`}>
              {alternative} Alternatives
            </NavigationLink>
          ))}

          <NavigationLink to="/alternatives" end>
            All Alternatives
          </NavigationLink>
        </Series>
      )}

      {children}
    </footer>
  )
}
