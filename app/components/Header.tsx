import { NavLink } from "@remix-run/react"
import {
  ShapesIcon,
  BracesIcon,
  ChevronDownIcon,
  CopyrightIcon,
  GemIcon,
  GithubIcon,
  PlusIcon,
  SmilePlusIcon,
  TagIcon,
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
import { Container } from "./Container"

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
        "group/menu fixed top-[var(--header-top)] inset-x-0 z-40 duration-300",
        "max-lg:data-[state=open]:bg-background/90 max-lg:data-[state=open]:backdrop-blur-sm",
        className,
      )}
      data-state={isNavOpen ? "open" : "close"}
      {...props}
    >
      <div className="fixed inset-x-0 h-[calc(var(--header-top)+var(--header-height)+2rem)] pointer-events-none bg-gradient-to-b from-background via-background to-transparent lg:h-[calc(var(--header-top)+var(--header-height)+3rem)]" />

      <div
        className={cx(
          "flex flex-wrap items-center py-3.5 gap-x-3 text-sm h-[var(--header-height)] isolate overflow-clip duration-300 lg:gap-4",
          "max-lg:group-data-[state=open]/menu:h-[calc(100dvh-(var(--header-top)*2))]",
        )}
      >
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
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className={cx(navigationLinkVariants({ className: "gap-1" }))}>
              Browse{" "}
              <ChevronDownIcon className="group-data-[state=open]:-rotate-180 duration-200" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <NavigationLink to="/latest">
                  <GemIcon className="size-4 opacity-75" /> Latest
                </NavigationLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavigationLink to="/categories">
                  <ShapesIcon className="size-4 opacity-75" /> Categories
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

        <nav
          className={cx(
            "size-full mt-10 mb-4 grid grid-auto-fill-xs place-items-start place-content-start gap-x-4 gap-y-6 px-1 transition-opacity lg:hidden",
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
          <NavigationLink to="/sponsor" className="text-base">
            Sponsor
          </NavigationLink>
          <NavigationLink to="/about" className="text-base">
            About
          </NavigationLink>
        </nav>
      </div>
    </Container>
  )
}
