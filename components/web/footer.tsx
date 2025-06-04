"use client"

import { formatNumber } from "@primoui/utils"
import type { ComponentProps } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { H5, H6 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { BuiltWith } from "~/components/web/built-with"
import { ExternalLink } from "~/components/web/external-link"
import { NewsletterForm } from "~/components/web/newsletter-form"
import { NavLink, navLinkVariants } from "~/components/web/ui/nav-link"
import { config } from "~/config"
import { cx } from "~/utils/cva"

type FooterProps = ComponentProps<"div"> & {
  hideNewsletter?: boolean
}

export const Footer = ({ children, className, hideNewsletter, ...props }: FooterProps) => {
  return (
    <footer
      className="flex flex-col gap-y-8 mt-auto pt-8 border-t border-foreground/10 md:pt-10 lg:pt-12"
      {...props}
    >
      <div
        className={cx("grid grid-cols-3 gap-y-8 gap-x-4 md:gap-x-6 md:grid-cols-16", className)}
        {...props}
      >
        <Stack
          direction="column"
          className="flex flex-col items-start gap-4 col-span-full md:col-span-6"
        >
          <Stack size="lg" direction="column" className="min-w-0 max-w-64">
            <H5 as="strong" className="px-0.5 font-medium">
              Subscribe to our newsletter
            </H5>

            <p className="-mt-2 px-0.5 text-xs text-muted-foreground first:mt-0">
              Join {formatNumber(config.stats.subscribers + config.stats.stars, "standard")}+ other
              members and get updates on new open source tools.
            </p>

            <NewsletterForm medium="footer_form" />
          </Stack>

          <Stack className="text-xl opacity-75">
            <DropdownMenu modal={false}>
              <Tooltip tooltip="RSS Feeds">
                <DropdownMenuTrigger aria-label="RSS Feeds">
                  <Icon name="lucide/rss" className="text-muted-foreground hover:text-foreground" />
                </DropdownMenuTrigger>
              </Tooltip>

              <DropdownMenuContent align="start" side="top">
                {config.links.feeds.map(({ url, title }) => (
                  <DropdownMenuItem key={url} asChild>
                    <ExternalLink href={url} className={navLinkVariants()}>
                      RSS &raquo; {title}
                    </ExternalLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip tooltip="Contact us">
              <ExternalLink href={`mailto:${config.site.email}`} className={navLinkVariants()}>
                <Icon name="lucide/at-sign" />
              </ExternalLink>
            </Tooltip>

            <Tooltip tooltip="View source code">
              <ExternalLink href={config.links.github} className={navLinkVariants()}>
                <Icon name="tabler/brand-github" />
              </ExternalLink>
            </Tooltip>

            <Tooltip tooltip="Follow us on X/Twitter">
              <ExternalLink href={config.links.twitter} className={navLinkVariants()}>
                <Icon name="tabler/brand-x" />
              </ExternalLink>
            </Tooltip>

            <Tooltip tooltip="Follow us on Bluesky">
              <ExternalLink href={config.links.bluesky} className={navLinkVariants()}>
                <Icon name="tabler/brand-bluesky" />
              </ExternalLink>
            </Tooltip>

            <Tooltip tooltip="Follow us on Mastodon">
              <ExternalLink href={config.links.mastodon} className={navLinkVariants()}>
                <Icon name="tabler/brand-mastodon" />
              </ExternalLink>
            </Tooltip>

            <Tooltip tooltip="Follow us on LinkedIn">
              <ExternalLink href={config.links.linkedin} className={navLinkVariants()}>
                <Icon name="tabler/brand-linkedin" />
              </ExternalLink>
            </Tooltip>

            <Tooltip tooltip="Join our community on Reddit">
              <ExternalLink href={config.links.reddit} className={navLinkVariants()}>
                <Icon name="tabler/brand-reddit" />
              </ExternalLink>
            </Tooltip>
          </Stack>
        </Stack>

        <Stack direction="column" className="text-sm md:col-span-3 md:col-start-8">
          <H6 as="strong">Browse:</H6>

          <NavLink href="/alternatives">Alternatives</NavLink>
          <NavLink href="/categories">Categories</NavLink>
          <NavLink href="/self-hosted">Self-hosted</NavLink>
          <NavLink href="/stacks">Tech Stacks</NavLink>
          <NavLink href="/topics">Topics</NavLink>
          <NavLink href="/licenses">Licenses</NavLink>
        </Stack>

        <Stack direction="column" className="text-sm md:col-span-3">
          <H6 as="strong">Quick Links:</H6>

          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="/advertise">Advertise</NavLink>
          <NavLink href="/submit">Add a Free Listing</NavLink>
        </Stack>

        <Stack direction="column" className="text-sm md:col-span-3">
          <H6 as="strong">Other Products:</H6>

          {config.links.family.map(({ href, title, description }) => (
            <ExternalLink
              key={href}
              href={href}
              title={description}
              className={navLinkVariants()}
              doFollow
            >
              {title}
            </ExternalLink>
          ))}
        </Stack>
      </div>

      <div className="flex flex-row flex-wrap items-end justify-between gap-x-4 gap-y-2 w-full text-sm text-muted-foreground **:[&[href]]:font-medium **:[&[href]]:text-foreground **:[&[href]]:hover:text-secondary-foreground">
        <BuiltWith medium="footer" />

        <p>
          Made by{" "}
          <ExternalLink href={config.links.author} data-link doFollow>
            Piotr Kulpinski
          </ExternalLink>
          . Website may contain affiliate links.
        </p>
      </div>

      {children}
    </footer>
  )
}
