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

          <Stack className="text-sm/normal">
            <DropdownMenu modal={false}>
              <Tooltip tooltip="RSS Feeds">
                <DropdownMenuTrigger aria-label="RSS Feeds">
                  <Icon
                    name="lucide/rss"
                    className="size-[1.44em] opacity-75 text-muted-foreground hover:text-foreground"
                  />
                </DropdownMenuTrigger>
              </Tooltip>

              <DropdownMenuContent align="start" side="top">
                {config.links.feeds.map(({ url, title }) => (
                  <DropdownMenuItem key={url} asChild>
                    <NavLink href={url} target="_blank" rel="nofollow noreferrer">
                      RSS &raquo; {title}
                    </NavLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip tooltip="Contact us">
              <NavLink
                href={`mailto:${config.site.email}`}
                target="_blank"
                rel="nofollow noreferrer"
                aria-label="Contact us"
              >
                <Icon name="lucide/at-sign" className="size-[1.44em] opacity-75" />
              </NavLink>
            </Tooltip>

            <Tooltip tooltip="View source code">
              <NavLink href={config.links.github} target="_blank" rel="nofollow noreferrer">
                <Icon name="tabler/brand-github" className="size-[1.44em] opacity-75" />
              </NavLink>
            </Tooltip>

            <Tooltip tooltip="Follow us on X/Twitter">
              <NavLink href={config.links.twitter} target="_blank" rel="nofollow noreferrer">
                <Icon name="tabler/brand-x" className="size-[1.44em] opacity-75" />
              </NavLink>
            </Tooltip>

            <Tooltip tooltip="Follow us on Bluesky">
              <NavLink href={config.links.bluesky} target="_blank" rel="nofollow noreferrer">
                <Icon name="tabler/brand-bluesky" className="size-[1.44em] opacity-75" />
              </NavLink>
            </Tooltip>

            <Tooltip tooltip="Follow us on Mastodon">
              <NavLink href={config.links.mastodon} target="_blank" rel="nofollow noreferrer">
                <Icon name="tabler/brand-mastodon" className="size-[1.44em] opacity-75" />
              </NavLink>
            </Tooltip>

            <Tooltip tooltip="Follow us on LinkedIn">
              <NavLink href={config.links.linkedin} target="_blank" rel="nofollow noreferrer">
                <Icon name="tabler/brand-linkedin" className="size-[1.44em] opacity-75" />
              </NavLink>
            </Tooltip>

            <a rel="me" href={config.links.mastodon} className="hidden">
              Mastodon
            </a>
          </Stack>
        </Stack>

        <Stack direction="column" className="text-sm/normal md:col-span-3 md:col-start-8">
          <H6 as="strong">Browse:</H6>

          <NavLink href="/alternatives">Alternatives</NavLink>
          <NavLink href="/categories">Categories</NavLink>
          <NavLink href="/self-hosted">Self-hosted</NavLink>
          <NavLink href="/stacks">Tech Stacks</NavLink>
          <NavLink href="/topics">Topics</NavLink>
          <NavLink href="/licenses">Licenses</NavLink>
        </Stack>

        <Stack direction="column" className="text-sm/normal md:col-span-3">
          <H6 as="strong">Quick Links:</H6>

          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="/advertise">Advertise</NavLink>
          <NavLink href="/submit">Add a Free Listing</NavLink>
        </Stack>

        <Stack direction="column" className="text-sm/normal md:col-span-3">
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
