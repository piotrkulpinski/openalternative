import { AtSignIcon, RssIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { ClientOnly } from "remix-utils/client-only"
import { H6 } from "~/components/Heading"
import { NavigationLink } from "~/components/NavigationLink"
import { Series } from "~/components/Series"
import { ThemeSwitcher } from "~/components/ThemeSwitcher"
import { Tooltip } from "~/components/Tooltip"
import { BrandGitHubIcon } from "~/components/icons/BrandGitHub"
import { BrandXIcon } from "~/components/icons/BrandX"
import { Newsletter } from "~/partials/Newsletter"
import {
  CLIMATE_URL,
  GITHUB_URL,
  RSS_URL,
  SITE_EMAIL,
  TWITTER_AUTHOR_URL,
  TWITTER_URL,
} from "~/utils/constants"
import { cx } from "~/utils/cva"

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
            title="Newsletter"
            description="Get updates on new tools, alternatives, and other cool stuff."
            medium="footer_form"
          />

          <Series className="text-sm/normal">
            <ClientOnly>{() => <ThemeSwitcher />}</ClientOnly>

            <Tooltip tooltip="RSS Feed">
              <NavigationLink to={RSS_URL} target="_blank" rel="nofollow noreferrer">
                <RssIcon className="size-[1.44em] stroke-[1.25]" />
              </NavigationLink>
            </Tooltip>

            <Tooltip tooltip="Contact Us">
              <NavigationLink to={`mailto:${SITE_EMAIL}`} target="_blank" rel="nofollow noreferrer">
                <AtSignIcon className="size-[1.44em] stroke-[1.25]" />
              </NavigationLink>
            </Tooltip>

            <Tooltip tooltip="X/Twitter">
              <NavigationLink to={TWITTER_URL} target="_blank" rel="nofollow noreferrer">
                <BrandXIcon className="size-[1.44em] stroke-[1.25]" />
              </NavigationLink>
            </Tooltip>

            <Tooltip tooltip="Source Code">
              <NavigationLink to={GITHUB_URL} target="_blank" rel="nofollow noreferrer">
                <BrandGitHubIcon className="size-[1.44em] stroke-[1.25]" />
              </NavigationLink>
            </Tooltip>
          </Series>
        </div>

        <Series className="gap-x-4 text-sm/normal flex-col items-start md:col-span-3 md:col-start-8">
          <H6 as="strong">Quick Links:</H6>

          <NavigationLink to="/blog">Blog</NavigationLink>
          <NavigationLink to="/about">About</NavigationLink>
          <NavigationLink to="/sponsor">Sponsor</NavigationLink>
          <NavigationLink to="/submit">Submit</NavigationLink>
          <NavigationLink to={`mailto:${SITE_EMAIL}`}>Contact</NavigationLink>
        </Series>

        <Series className="gap-x-4 text-sm/normal flex-col items-start md:col-span-3">
          <H6 as="strong">Browse:</H6>

          <NavigationLink to="/alternatives">Alternatives</NavigationLink>
          <NavigationLink to="/categories">Categories</NavigationLink>
          <NavigationLink to="/languages">Languages</NavigationLink>
          <NavigationLink to="/topics">Topics</NavigationLink>
          <NavigationLink to="/licenses">Licenses</NavigationLink>
        </Series>

        <Series className="gap-x-4 text-sm/normal flex-col items-start md:col-span-3">
          <H6 as="strong">The Family:</H6>

          <NavigationLink to="https://openalternative.co" target="_blank" rel="nofollow noreferrer">
            OpenAlternative
          </NavigationLink>
          <NavigationLink to="https://superstash.co" target="_blank" rel="nofollow noreferrer">
            Superstash
          </NavigationLink>
          <NavigationLink to="https://chipmunktheme.com" target="_blank" rel="nofollow noreferrer">
            Chipmunk Theme
          </NavigationLink>
        </Series>
      </div>

      <div className="flex flex-row flex-wrap items-end justify-between gap-x-4 gap-y-2 w-full">
        <Series direction="column">
          <NavigationLink to={TWITTER_AUTHOR_URL} className="text-xs">
            <img
              src="/users/1.jpg"
              alt="Piotr Kulpinski"
              loading="lazy"
              width="16"
              height="16"
              decoding="async"
              className="max-sm:hidden size-4 rounded-full"
            />
            Made by Piotr Kulpinski
          </NavigationLink>

          <NavigationLink to={CLIMATE_URL} target="_blank" className="text-xs">
            <img
              src="/stripe-climate-badge.svg"
              alt="Stripe Climate Badge"
              loading="lazy"
              width="16"
              height="16"
              decoding="async"
              className="max-sm:hidden size-4"
            />
            We contribute part of our revenue to carbon removal
          </NavigationLink>
        </Series>

        <p className="text-xs text-muted">This website may contain affiliate links</p>
      </div>

      {children}
    </footer>
  )
}
