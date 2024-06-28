import { NavLink } from "@remix-run/react"
import {
  BlocksIcon,
  BracesIcon,
  ChevronDownIcon,
  CopyrightIcon,
  GemIcon,
  GithubIcon,
  MenuIcon,
  PlusIcon,
  SmilePlusIcon,
  TagIcon,
  XIcon,
} from "lucide-react"
import { type HTMLAttributes, useEffect, useState } from "react"
import { GITHUB_URL } from "~/utils/constants"
import { cx } from "~/utils/cva"
import { Breadcrumbs } from "./Breadcrumbs"
import { Button } from "./Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./DropdownMenu"
import { NavigationLink, navigationLinkVariants } from "./NavigationLink"
import { Series } from "./Series"
import { ClientOnly } from "remix-utils/client-only"
import { ThemeSwitcher } from "./ThemeSwitcher"

export const Header = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const [isNavOpen, setNavOpen] = useState(false)

  // Close the mobile navigation when the user presses the "Escape" key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div
      className={cx(
        "sticky top-0 z-10 flex flex-wrap items-center py-3 -my-3 gap-3 backdrop-blur-sm bg-background/95 md:gap-4",
        className,
      )}
      {...props}
    >
      <button type="button" onClick={() => setNavOpen(!isNavOpen)} className="lg:hidden">
        <MenuIcon className={cx("size-6 stroke-[1.5]", isNavOpen && "hidden")} />
        <XIcon className={cx("size-6 stroke-[1.5]", !isNavOpen && "hidden")} />
        <span className="sr-only">Toggle navigation</span>
      </button>

      <Breadcrumbs className="mr-auto" />

      <nav className="contents max-lg:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className={cx(navigationLinkVariants({ className: "gap-1" }))}>
            Browse <ChevronDownIcon className="group-data-[state=open]:-rotate-180 duration-200" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <NavigationLink to="/latest">
                <GemIcon className="size-4 opacity-75" /> Latest
              </NavigationLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavigationLink to="/categories">
                <BlocksIcon className="size-4 opacity-75" /> Categories
              </NavigationLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavigationLink to="/alternatives">
                <SmilePlusIcon className="size-4 opacity-75" /> Alternatives
              </NavigationLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavigationLink to="/languages">
                <BracesIcon className="size-4 opacity-75" /> Languages
              </NavigationLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavigationLink to="/topics">
                <TagIcon className="size-4 opacity-75" /> Topics
              </NavigationLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavigationLink to="/licenses">
                <CopyrightIcon className="size-4 opacity-75" /> Licenses
              </NavigationLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <NavigationLink to="/about">About</NavigationLink>
        <NavigationLink to="/sponsor">Sponsor</NavigationLink>
      </nav>

      <Series size="sm">
        <ClientOnly>{() => <ThemeSwitcher />}</ClientOnly>

        <Button
          size="sm"
          variant="secondary"
          prefix={<GithubIcon className="mr-0.5" />}
          className="max-sm:hidden"
          asChild
        >
          <a href={GITHUB_URL} target="_blank" rel="nofollow noreferrer">
            Star
          </a>
        </Button>

        <Button size="sm" variant="secondary" prefix={<PlusIcon />} asChild>
          <NavLink to="/submit" unstable_viewTransition>
            Submit
          </NavLink>
        </Button>
      </Series>

      {isNavOpen && (
        <nav className="mt-2 flex flex-col gap-y-2 w-full lg:hidden">
          <NavigationLink to="/latest">Latest</NavigationLink>
          <NavigationLink to="/categories">Categories</NavigationLink>
          <NavigationLink to="/alternatives">Alternatives</NavigationLink>
          <NavigationLink to="/languages">Languages</NavigationLink>
          <NavigationLink to="/topics">Topics</NavigationLink>
          <NavigationLink to="/submit">Submit</NavigationLink>
          <NavigationLink to="/sponsor">Sponsor</NavigationLink>
          <NavigationLink to="/about">About</NavigationLink>
        </nav>
      )}
    </div>
  )
}
