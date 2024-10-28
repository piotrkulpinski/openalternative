import { NavLink } from "@remix-run/react"
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  CodeXmlIcon,
  CopyrightIcon,
  GalleryHorizontalEndIcon,
  PlusIcon,
  ReplaceIcon,
  TagIcon,
} from "lucide-react"
import { type HTMLAttributes, useEffect, useState } from "react"
import { Breadcrumbs } from "~/components/ui/breadcrumbs"
import { Button } from "~/components/ui/button"
import { Container } from "~/components/ui/container"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { BrandGitHubIcon } from "~/components/ui/icons/brand-github"
import { BrandXIcon } from "~/components/ui/icons/brand-x"
import { NavigationLink, navigationLinkVariants } from "~/components/ui/navigation-link"
import { SearchForm } from "~/components/ui/search-form"
import { Stack } from "~/components/ui/stack"
import { GITHUB_URL, TWITTER_URL } from "~/utils/constants"
import { cx } from "~/utils/cva"

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
    <Container
      className={cx(
        "group/menu sticky top-[var(--header-top)] inset-x-0 z-50 duration-300",
        "max-lg:data-[state=open]:bg-background/90",
        className,
      )}
      id="header"
      role="banner"
      data-state={isNavOpen ? "open" : "close"}
      {...props}
    >
      <div className="absolute top-0 inset-x-0 h-[calc(var(--header-top)+var(--header-height)+2rem)] pointer-events-none bg-gradient-to-b from-background via-background to-transparent lg:h-[calc(var(--header-top)+var(--header-height)+3rem)]" />

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
              className="fill-none duration-300 stroke-current stroke-[5] [stroke-linecap:round] [stroke-dasharray:40_121] group-data-[state=open]/menu:[stroke-dashoffset:-68px]"
              d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20"
            />
            <path
              className="fill-none duration-300 stroke-current stroke-[5] [stroke-linecap:round]"
              d="m 55,50 h -25"
            />
            <path
              className="fill-none duration-300 stroke-current stroke-[5] [stroke-linecap:round] [stroke-dasharray:40_121] group-data-[state=open]/menu:[stroke-dashoffset:-68px]"
              d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20"
            />
          </svg>
        </button>

        <Breadcrumbs className="mr-auto flex-1" />

        <nav className="contents max-lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className={cx(navigationLinkVariants({ className: "gap-1" }))}>
              Browse{" "}
              <ChevronDownIcon className="group-data-[state=open]:-rotate-180 duration-200" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <NavigationLink to="/latest" unstable_viewTransition>
                  <CalendarDaysIcon className="shrink-0 size-4 opacity-75" /> Latest tools
                </NavigationLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavigationLink to="/categories" unstable_viewTransition>
                  <GalleryHorizontalEndIcon className="shrink-0 size-4 opacity-75" /> Categories
                </NavigationLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavigationLink to="/alternatives" unstable_viewTransition>
                  <ReplaceIcon className="shrink-0 size-4 opacity-75" /> Alternatives
                </NavigationLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavigationLink to="/languages" unstable_viewTransition>
                  <CodeXmlIcon className="shrink-0 size-4 opacity-75" /> Languages
                </NavigationLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavigationLink to="/topics" unstable_viewTransition>
                  <TagIcon className="shrink-0 size-4 opacity-75" /> Topics
                </NavigationLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavigationLink to="/licenses" unstable_viewTransition>
                  <CopyrightIcon className="shrink-0 size-4 opacity-75" /> Licenses
                </NavigationLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <NavigationLink to="/random">Random Tool</NavigationLink>
          <NavigationLink to="/advertise">Advertise</NavigationLink>
        </nav>

        <Stack size="sm">
          <SearchForm className="max-sm:hidden" />

          <NavigationLink to={TWITTER_URL} target="_blank" rel="nofollow noreferrer">
            <BrandXIcon className="size-4" />
          </NavigationLink>

          <NavigationLink to={GITHUB_URL} target="_blank" rel="nofollow noreferrer">
            <BrandGitHubIcon className="size-4" />
          </NavigationLink>

          <Button size="sm" variant="secondary" prefix={<PlusIcon />} asChild>
            <NavLink to="/submit" unstable_viewTransition>
              Submit
            </NavLink>
          </Button>
        </Stack>
      </div>

      <nav
        className={cx(
          "absolute top-full inset-x-0 h-[calc(100dvh-var(--header-top)-var(--header-height))] -mt-px py-4 px-6 grid grid-cols-2 place-items-start place-content-start gap-x-4 gap-y-6 bg-background/90 backdrop-blur-lg transition-opacity lg:hidden",
          isNavOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <NavigationLink to="/latest" className="text-base">
          Latest
        </NavigationLink>
        <NavigationLink to="/categories" className="text-base">
          Categories
        </NavigationLink>
        <NavigationLink to="/alternatives" className="text-base">
          Alternatives
        </NavigationLink>
        <NavigationLink to="/languages" className="text-base">
          Languages
        </NavigationLink>
        <NavigationLink to="/topics" className="text-base">
          Topics
        </NavigationLink>
        <NavigationLink to="/submit" className="text-base">
          Submit
        </NavigationLink>
        <NavigationLink to="/advertise" className="text-base">
          Advertise
        </NavigationLink>
        <NavigationLink to="/about" className="text-base">
          About
        </NavigationLink>

        <SearchForm className="sm:hidden" />
      </nav>
    </Container>
  )
}
