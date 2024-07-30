import { AtSignIcon, GithubIcon, RssIcon, TwitterIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { GITHUB_URL, RSS_URL, SITE_EMAIL, TWITTER_AUTHOR_URL, TWITTER_URL } from "~/utils/constants"
import { cx } from "~/utils/cva"
import { H6 } from "~/components/Heading"
import { NavigationLink } from "~/components/NavigationLink"
import { Series } from "~/components/Series"
import { CategoryMany } from "~/services.server/api"
import { slugify } from "@curiousleaf/utils"
import { SerializeFrom } from "@remix-run/node"
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
            <TwitterIcon className="size-[1.44em] stroke-[1.25]" />
          </NavigationLink>

          <NavigationLink to={GITHUB_URL} target="_blank" title="Source" rel="nofollow noreferrer">
            <GithubIcon className="size-[1.44em] stroke-[1.25]" />
          </NavigationLink>
        </Series>

        <NavigationLink to={TWITTER_AUTHOR_URL} className="mt-auto">
          Made by Piotr Kulpinski
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
