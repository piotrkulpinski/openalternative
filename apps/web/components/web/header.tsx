"use client"

import {
  BlocksIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  CopyrightIcon,
  GalleryHorizontalEndIcon,
  SearchIcon,
  ServerIcon,
  TagIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { type ComponentProps, Suspense, useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { BrandBlueskyIcon } from "~/components/common/icons/brand-bluesky"
import { BrandGitHubIcon } from "~/components/common/icons/brand-github"
import { BrandXIcon } from "~/components/common/icons/brand-x"
import { Stack } from "~/components/common/stack"
import { SearchForm } from "~/components/web/search-form"
import { Container } from "~/components/web/ui/container"
import { Hamburger } from "~/components/web/ui/hamburger"
import { Logo } from "~/components/web/ui/logo"
import { NavLink, navLinkVariants } from "~/components/web/ui/nav-link"
import { config } from "~/config"
import { cx } from "~/utils/cva"

export const Header = ({ children, className, ...props }: ComponentProps<typeof Container>) => {
  const pathname = usePathname()
  const [isNavOpen, setNavOpen] = useState(false)

  // Close the mobile navigation when the user presses the "Escape" key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  return (
    <Container
      className={cx(
        "group/menu sticky top-[var(--header-top)] inset-x-0 z-[49] duration-300",
        "max-lg:data-[state=open]:bg-background/90",
        className,
      )}
      id="header"
      role="banner"
      data-state={isNavOpen ? "open" : "close"}
      {...props}
    >
      <div className="absolute top-0 inset-x-0 h-[calc(var(--header-top)+var(--header-height)+2rem)] pointer-events-none bg-linear-to-b from-background via-background to-transparent lg:h-[calc(var(--header-top)+var(--header-height)+3rem)]" />

      <div className="relative flex items-center py-3.5 gap-x-3 text-sm h-[var(--header-height)] isolate duration-300 lg:gap-4">
        <Stack size="sm" wrap={false} className="mr-auto">
          <button
            type="button"
            onClick={() => setNavOpen(!isNavOpen)}
            className="block -m-1 -ml-1.5 lg:hidden"
          >
            <Hamburger className="size-7" />
          </button>

          <Logo />
        </Stack>

        <nav className="contents max-lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className={cx(navLinkVariants({ className: "gap-1" }))}>
              Browse{" "}
              <ChevronDownIcon className="group-data-[state=open]:-rotate-180 duration-200" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <NavLink href="/latest">
                  <CalendarDaysIcon className="shrink-0 size-4 opacity-75" /> Latest tools
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink href="/categories">
                  <GalleryHorizontalEndIcon className="shrink-0 size-4 opacity-75" /> Categories
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink href="/self-hosted">
                  <ServerIcon className="shrink-0 size-4 opacity-75" /> Self-hosted
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink href="/stacks">
                  <BlocksIcon className="shrink-0 size-4 opacity-75" /> Tech Stacks
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink href="/topics">
                  <TagIcon className="shrink-0 size-4 opacity-75" /> Topics
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink href="/licenses">
                  <CopyrightIcon className="shrink-0 size-4 opacity-75" /> Licenses
                </NavLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <NavLink href="/alternatives">Alternatives</NavLink>
          <NavLink href="/self-hosted">Self-hosted</NavLink>
          <NavLink href="/advertise">Advertise</NavLink>
          <NavLink href="/submit">Submit</NavLink>
        </nav>

        <Stack size="sm" className="max-sm:hidden">
          <Suspense fallback={<SearchIcon className="size-4" />}>
            <SearchForm />
          </Suspense>

          <NavLink
            href={config.links.twitter}
            target="_blank"
            rel="nofollow noreferrer"
            title="Follow us on X"
          >
            <BrandXIcon className="size-4" />
          </NavLink>

          <NavLink
            href={config.links.bluesky}
            target="_blank"
            rel="nofollow noreferrer"
            title="Follow us on Bluesky"
          >
            <BrandBlueskyIcon className="size-4" />
          </NavLink>

          <NavLink
            href={config.links.github}
            target="_blank"
            rel="nofollow noreferrer"
            title="View source code"
          >
            <BrandGitHubIcon className="size-4" />
          </NavLink>
        </Stack>

        {children}
      </div>

      <nav
        className={cx(
          "absolute top-full inset-x-0 h-[calc(100dvh-var(--header-top)-var(--header-height))] -mt-px py-4 px-6 grid grid-cols-2 place-items-start place-content-start gap-x-4 gap-y-6 bg-background/90 backdrop-blur-lg transition-opacity lg:hidden",
          isNavOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <NavLink href="/latest" className="text-base">
          Latest
        </NavLink>
        <NavLink href="/alternatives" className="text-base">
          Alternatives
        </NavLink>
        <NavLink href="/categories" className="text-base">
          Categories
        </NavLink>
        <NavLink href="/self-hosted" className="text-base">
          Self-hosted
        </NavLink>
        <NavLink href="/stacks" className="text-base">
          Tech Stacks
        </NavLink>
        <NavLink href="/topics" className="text-base">
          Topics
        </NavLink>
        <NavLink href="/submit" className="text-base">
          Submit
        </NavLink>
        <NavLink href="/advertise" className="text-base">
          Advertise
        </NavLink>
        <NavLink href="/about" className="text-base">
          About
        </NavLink>

        <Suspense fallback={<SearchIcon className="size-4 sm:hidden" />}>
          <SearchForm className="sm:hidden" />
        </Suspense>
      </nav>
    </Container>
  )
}
