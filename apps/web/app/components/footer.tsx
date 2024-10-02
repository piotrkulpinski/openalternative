import { formatNumber } from "@curiousleaf/utils"
import { AtSignIcon, RssIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { ClientOnly } from "remix-utils/client-only"
import { Newsletter } from "~/components/newsletter"
import { H6 } from "~/components/ui/heading"
import { BrandGitHubIcon } from "~/components/ui/icons/brand-github"
import { BrandLinkedInIcon } from "~/components/ui/icons/brand-linkedin"
import { BrandXIcon } from "~/components/ui/icons/brand-x"
import { NavigationLink } from "~/components/ui/navigation-link"
import { Stack } from "~/components/ui/stack"
import { ThemeSwitcher } from "~/components/ui/theme-switcher"
import { Tooltip, TooltipProvider } from "~/components/ui/tooltip"
import {
  FAMILY_LINKS,
  GITHUB_URL,
  LINKEDIN_URL,
  SITE_EMAIL,
  SITE_NAME,
  SITE_STATS,
  SITE_URL,
  TWITTER_AUTHOR_URL,
  TWITTER_URL,
} from "~/utils/constants"
import { cx } from "~/utils/cva"
import { addUTMTracking } from "~/utils/helpers"

export const Footer = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <footer className="flex flex-col gap-y-8 mt-auto pt-8 border-t border-muted/15 md:pt-10 lg:pt-12">
      <div
        className={cx(
          "grid grid-cols-3 gap-y-8 gap-x-4 md:gap-x-6 md:grid-cols-[repeat(16,minmax(0,1fr))]",
          className,
        )}
        {...props}
      >
        <div className="flex flex-col items-start gap-4 col-span-full md:col-span-6">
          <Newsletter
            title="Subscribe to our newsletter"
            description={`Join ${formatNumber(SITE_STATS.subscribers, "standard")}+ other members and get updates on new open source tools.`}
            medium="footer_form"
          />

          <Stack className="text-sm/normal">
            <TooltipProvider delayDuration={500} disableHoverableContent>
              <ClientOnly>{() => <ThemeSwitcher />}</ClientOnly>

              <Tooltip tooltip="RSS Feed">
                <NavigationLink
                  to={`${SITE_URL}/rss.xml`}
                  target="_blank"
                  rel="nofollow noreferrer"
                >
                  <RssIcon className="size-[1.44em] stroke-[1.25]" />
                </NavigationLink>
              </Tooltip>

              <Tooltip tooltip="Contact Us">
                <NavigationLink
                  to={`mailto:${SITE_EMAIL}`}
                  target="_blank"
                  rel="nofollow noreferrer"
                >
                  <AtSignIcon className="size-[1.44em] stroke-[1.25]" />
                </NavigationLink>
              </Tooltip>

              <Tooltip tooltip="X/Twitter">
                <NavigationLink to={TWITTER_URL} target="_blank" rel="nofollow noreferrer">
                  <BrandXIcon className="size-[1.44em] stroke-[1.25]" />
                </NavigationLink>
              </Tooltip>

              <Tooltip tooltip="LinkedIn">
                <NavigationLink to={LINKEDIN_URL} target="_blank" rel="nofollow noreferrer">
                  <BrandLinkedInIcon className="size-[1.44em] stroke-[1.25]" />
                </NavigationLink>
              </Tooltip>

              <Tooltip tooltip="Source Code">
                <NavigationLink to={GITHUB_URL} target="_blank" rel="nofollow noreferrer">
                  <BrandGitHubIcon className="size-[1.44em] stroke-[1.25]" />
                </NavigationLink>
              </Tooltip>
            </TooltipProvider>
          </Stack>
        </div>

        <Stack className="gap-x-4 text-sm/normal flex-col items-start md:col-span-3 md:col-start-8">
          <H6 as="strong">Browse:</H6>

          <NavigationLink to="/alternatives">Alternatives</NavigationLink>
          <NavigationLink to="/categories">Categories</NavigationLink>
          <NavigationLink to="/languages">Languages</NavigationLink>
          <NavigationLink to="/topics">Topics</NavigationLink>
          <NavigationLink to="/licenses">Licenses</NavigationLink>
        </Stack>

        <Stack className="gap-x-4 text-sm/normal flex-col items-start md:col-span-3">
          <H6 as="strong">Quick Links:</H6>

          <NavigationLink to="/advertise">Advertise with Us</NavigationLink>
          <NavigationLink to="/submit">Add a Free Listing</NavigationLink>
          <NavigationLink to="/about">About Us</NavigationLink>
          <NavigationLink to={`mailto:${SITE_EMAIL}`}>Contact Us</NavigationLink>
          <NavigationLink to="/blog">Blog</NavigationLink>
        </Stack>

        <Stack className="gap-x-4 text-sm/normal flex-col items-start md:col-span-3">
          <H6 as="strong">Other Products:</H6>

          {FAMILY_LINKS.map(link => (
            <NavigationLink
              key={link.href}
              to={addUTMTracking(link.href, { source: SITE_NAME.toLowerCase() })}
              target="_blank"
              rel="noreferrer noopener"
              title={link.description}
            >
              {link.title}
            </NavigationLink>
          ))}
        </Stack>
      </div>

      <div className="flex flex-row flex-wrap items-end justify-between gap-x-4 gap-y-2 w-full">
        <NavigationLink
          to={TWITTER_AUTHOR_URL}
          className="text-xs"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          <img
            src="/authors/piotrkulpinski.jpg"
            alt="Piotr Kulpinski"
            loading="lazy"
            width="16"
            height="16"
            decoding="async"
            className="max-sm:hidden size-4 rounded-full"
          />
          Made by Piotr Kulpinski
        </NavigationLink>

        <p className="text-xs text-muted">This website may contain affiliate links</p>
      </div>

      {children}
    </footer>
  )
}
