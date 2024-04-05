import { Await, Link } from "@remix-run/react"
import { HTMLAttributes, Suspense, useState } from "react"
import { cx } from "~/utils/cva"
import { Button } from "./Button"
import { GithubIcon, LoaderIcon, MenuIcon, PlusIcon, XIcon } from "lucide-react"
import { Navigation } from "./Navigation"
import { Breadcrumbs } from "./Breadcrumbs"
import { ThemeSwitcher } from "./ThemeSwitcher"
import { Series } from "./Series"
import { Badge } from "./Badge"
import { RepositoryStarsQueryResult } from "~/utils/github"

type HeaderProps = HTMLAttributes<HTMLElement> & {
  repositoryQuery: Promise<RepositoryStarsQueryResult>
}

export const Header = ({ className, repositoryQuery, ...props }: HeaderProps) => {
  const [isNavOpen, setNavOpen] = useState(false)
  const formatter = new Intl.NumberFormat("en-US", { notation: "compact" })

  return (
    <div className={cx("flex flex-wrap items-center gap-3 md:gap-4", className)} {...props}>
      <button type="button" onClick={() => setNavOpen(!isNavOpen)} className="lg:hidden">
        <MenuIcon className={cx("size-6 stroke-[1.5]", isNavOpen && "hidden")} />
        <XIcon className={cx("size-6 stroke-[1.5]", !isNavOpen && "hidden")} />
        <span className="sr-only">Toggle navigation</span>
      </button>

      <Breadcrumbs className="mr-auto" />

      <Navigation className="max-lg:hidden" />

      <Series size="sm">
        <ThemeSwitcher />

        <Button
          size="sm"
          variant="secondary"
          prefix={<GithubIcon />}
          suffix={
            <Badge size="sm" className="-my-0.5 size-auto">
              <Suspense fallback={<LoaderIcon className="size-3 animate-spin" />}>
                <Await resolve={repositoryQuery}>
                  {(repositoryQuery) => formatter.format(repositoryQuery.repository.stargazerCount)}
                </Await>
              </Suspense>
            </Badge>
          }
          asChild
        >
          <a
            href="https://github.com/piotrkulpinski/openalternative"
            target="_blank"
            title="Source Code"
            rel="nofollow noreferrer"
          >
            Star
          </a>
        </Button>

        <Button size="sm" variant="secondary" prefix={<PlusIcon />} className="-my-1.5" asChild>
          <Link to="/submit" unstable_viewTransition>
            Submit
          </Link>
        </Button>
      </Series>

      {isNavOpen && <Navigation className="mt-2 w-full lg:hidden" showAllLinks />}
    </div>
  )
}
