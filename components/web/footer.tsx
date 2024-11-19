import { formatNumber } from "@curiousleaf/utils"
import { AtSignIcon, RssIcon } from "lucide-react"
import Link from "next/link"
import type { HTMLAttributes } from "react"
import { H6 } from "~/components/common/heading"
import { BrandBlueskyIcon } from "~/components/common/icons/brand-bluesky"
import { BrandGitHubIcon } from "~/components/common/icons/brand-github"
import { BrandLinkedInIcon } from "~/components/common/icons/brand-linkedin"
import { BrandXIcon } from "~/components/common/icons/brand-x"
import { Stack } from "~/components/common/stack"
import { Newsletter } from "~/components/web/newsletter"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/web/ui/dropdown-menu"
import { Logo } from "~/components/web/ui/logo"
import { NavigationLink } from "~/components/web/ui/navigation-link"
import { ThemeSwitcher } from "~/components/web/ui/theme-switcher"
import { Tooltip, TooltipProvider } from "~/components/web/ui/tooltip"
import { config } from "~/config"
import { cx } from "~/utils/cva"
import { addUTMTracking } from "~/utils/helpers"

type FooterProps = HTMLAttributes<HTMLElement> & {
  hideNewsletter?: boolean
}

export const Footer = ({ children, className, hideNewsletter, ...props }: FooterProps) => {
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
          {hideNewsletter ? (
            <Stack direction="column" className="text-sm/normal">
              <Stack size="sm" className="group/link" asChild>
                <Link href="/">
                  <Logo className="size-5 shrink-0" />
                  <span className="font-display font-medium text-sm">{config.site.name}</span>
                </Link>
              </Stack>

              <p className="text-foreground/65 max-w-80">{config.site.description}</p>
            </Stack>
          ) : (
            <Newsletter
              title="Subscribe to our newsletter"
              description={`Join ${formatNumber(config.stats.subscribers, "standard")}+ other members and get updates on new open source tools.`}
              medium="footer_form"
            />
          )}

          <Stack className="text-sm/normal">
            <TooltipProvider delayDuration={500} disableHoverableContent>
              <ThemeSwitcher />

              <DropdownMenu modal={false}>
                <Tooltip tooltip="RSS Feeds">
                  <DropdownMenuTrigger aria-label="RSS Feeds" {...props}>
                    <RssIcon className="size-[1.44em] stroke-[1.25] text-muted hover:text-foreground" />
                  </DropdownMenuTrigger>
                </Tooltip>

                <DropdownMenuContent align="start" side="top">
                  {config.links.feeds.map(({ href, title }) => (
                    <DropdownMenuItem key={href} asChild>
                      <Link href={href} target="_blank" rel="nofollow noreferrer">
                        RSS &raquo; {title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Tooltip tooltip="Contact us">
                <NavigationLink
                  href={`mailto:${config.site.email}`}
                  target="_blank"
                  rel="nofollow noreferrer"
                  aria-label="Contact us"
                >
                  <AtSignIcon className="size-[1.44em] stroke-[1.25]" />
                </NavigationLink>
              </Tooltip>

              <Tooltip tooltip="Follow us on X/Twitter">
                <NavigationLink
                  href={config.links.twitter}
                  target="_blank"
                  rel="nofollow noreferrer"
                >
                  <BrandXIcon className="size-[1.44em] stroke-[1.25]" />
                </NavigationLink>
              </Tooltip>

              <Tooltip tooltip="Follow us on Bluesky">
                <NavigationLink
                  href={config.links.bluesky}
                  target="_blank"
                  rel="nofollow noreferrer"
                >
                  <BrandBlueskyIcon className="size-[1.44em] stroke-[1.25]" />
                </NavigationLink>
              </Tooltip>

              <Tooltip tooltip="Follow us on LinkedIn">
                <NavigationLink
                  href={config.links.linkedin}
                  target="_blank"
                  rel="nofollow noreferrer"
                >
                  <BrandLinkedInIcon className="size-[1.44em] stroke-[1.25]" />
                </NavigationLink>
              </Tooltip>

              <Tooltip tooltip="View source code">
                <NavigationLink
                  href={config.links.github}
                  target="_blank"
                  rel="nofollow noreferrer"
                >
                  <BrandGitHubIcon className="size-[1.44em] stroke-[1.25]" />
                </NavigationLink>
              </Tooltip>
            </TooltipProvider>
          </Stack>
        </div>

        <Stack className="gap-x-4 text-sm/normal flex-col items-start md:col-span-3 md:col-start-8">
          <H6 as="strong">Browse:</H6>

          <NavigationLink href="/alternatives">Alternatives</NavigationLink>
          <NavigationLink href="/categories">Categories</NavigationLink>
          <NavigationLink href="/languages">Languages</NavigationLink>
          <NavigationLink href="/topics">Topics</NavigationLink>
          <NavigationLink href="/licenses">Licenses</NavigationLink>
        </Stack>

        <Stack className="gap-x-4 text-sm/normal flex-col items-start md:col-span-3">
          <H6 as="strong">Quick Links:</H6>

          <NavigationLink href="/advertise">Advertise with Us</NavigationLink>
          <NavigationLink href="/submit">Add a Free Listing</NavigationLink>
          <NavigationLink href="/about">About Us</NavigationLink>
          <NavigationLink href="/newsletter">Newsletter</NavigationLink>
          <NavigationLink href="/blog">Blog</NavigationLink>
        </Stack>

        <Stack className="gap-x-4 text-sm/normal flex-col items-start md:col-span-3">
          <H6 as="strong">Other Products:</H6>

          {config.links.family.map(({ href, title, description }) => (
            <NavigationLink
              key={href}
              href={addUTMTracking(href, { source: config.site.name.toLowerCase() })}
              target="_blank"
              rel="noreferrer noopener"
              title={description}
            >
              {title}
            </NavigationLink>
          ))}
        </Stack>
      </div>

      <div className="flex flex-row flex-wrap items-end justify-between gap-x-4 gap-y-2 w-full">
        <NavigationLink
          href={config.links.author}
          className="text-xs"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          <img
            src="/authors/piotrkulpinski.webp"
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
