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
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type HTMLAttributes, Suspense, useEffect, useState } from "react"
import { BrandBlueskyIcon } from "~/components/common/icons/brand-bluesky"
import { BrandGitHubIcon } from "~/components/common/icons/brand-github"
import { BrandXIcon } from "~/components/common/icons/brand-x"
import { Stack } from "~/components/common/stack"
import { SearchForm } from "~/components/web/search-form"
import { Button } from "~/components/web/ui/button"
import { Container } from "~/components/web/ui/container"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/web/ui/dropdown-menu"
import { Logo } from "~/components/web/ui/logo"
import { NavLink, navLinkVariants } from "~/components/web/ui/nav-link"
import { config } from "~/config"
import { cx } from "~/utils/cva"

export const Header = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
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

      <div className="relative flex flex-nowrap items-center py-3.5 gap-x-3 text-sm h-[var(--header-height)] isolate duration-300 lg:gap-4">
        <button
          type="button"
          onClick={() => setNavOpen(!isNavOpen)}
          className="block -m-1 lg:hidden"
          aria-label="Toggle navigation"
        >
          <svg
            className="size-7 duration-300 select-none will-change-transform group-data-[state=open]/menu:rotate-45"
            viewBox="0 0 100 100"
            role="img"
            aria-label="Toggle navigation icon"
          >
            <path
              className="fill-none duration-300 stroke-current stroke-5 [stroke-linecap:round] [stroke-dasharray:40_121] group-data-[state=open]/menu:[stroke-dashoffset:-68px]"
              d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20"
            />
            <path
              className="fill-none duration-300 stroke-current stroke-5 [stroke-linecap:round]"
              d="m 55,50 h -25"
            />
            <path
              className="fill-none duration-300 stroke-current stroke-5 [stroke-linecap:round] [stroke-dasharray:40_121] group-data-[state=open]/menu:[stroke-dashoffset:-68px]"
              d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20"
            />
          </svg>
        </button>

        <Logo className="mr-auto" />

        <nav className="contents max-lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className={cx(navLinkVariants({ className: "gap-1" }))}>
              Browse{" "}
              <ChevronDownIcon className="group-data-[state=open]:-rotate-180 duration-200" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <NavLink href="/?sort=publishedAt.desc">
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
          <NavLink href="/advertise">Advertise</NavLink>
        </nav>

        <Stack size="sm" className="max-sm:hidden">
          <Suspense fallback={<SearchIcon className="size-4" />}>
            <SearchForm />
          </Suspense>

          <NavLink
            href={config.links.bluesky}
            target="_blank"
            rel="nofollow noreferrer"
            title="Follow us on Bluesky"
          >
            <BrandBlueskyIcon className="size-4" />
          </NavLink>

          <NavLink
            href={config.links.twitter}
            target="_blank"
            rel="nofollow noreferrer"
            title="Follow us on X"
          >
            <BrandXIcon className="size-4" />
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

        <Button size="sm" variant="secondary" asChild>
          <Link href="/submit" prefetch={false}>
            Submit
          </Link>
        </Button>
      </div>

      <nav
        className={cx(
          "absolute top-full inset-x-0 h-[calc(100dvh-var(--header-top)-var(--header-height))] -mt-px py-4 px-6 grid grid-cols-2 place-items-start place-content-start gap-x-4 gap-y-6 bg-background/90 backdrop-blur-lg transition-opacity lg:hidden",
          isNavOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <NavLink href="/?sort=publishedAt.desc" className="text-base">
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
