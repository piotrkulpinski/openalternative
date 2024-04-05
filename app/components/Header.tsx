import { Link } from "@remix-run/react"
import useSWR from "swr"
import { HTMLAttributes, useState } from "react"
import { cx } from "~/utils/cva"
import { Button } from "./Button"
import { GithubIcon, LoaderIcon, MenuIcon, PlusIcon, XIcon } from "lucide-react"
import { Navigation } from "./Navigation"
import { Breadcrumbs } from "./Breadcrumbs"
import { ThemeSwitcher } from "./ThemeSwitcher"
import { Series } from "./Series"
import { Badge } from "./Badge"
import { Ping } from "./Ping"
import { GITHUB_URL } from "~/utils/constants"
import { getRepoOwnerAndName } from "~/utils/github"

export const Header = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const [isNavOpen, setNavOpen] = useState(false)
  const repo = getRepoOwnerAndName(GITHUB_URL)
  const formatter = new Intl.NumberFormat("en-US", { notation: "compact" })

  const fetcher = async (url: string) => {
    const r = await fetch(url, {
      method: "POST",
      body: JSON.stringify(repo),
      headers: { "Content-Type": "application/json" },
    })
    return await r.json()
  }

  const { data, error, isLoading } = useSWR<number>("/api/fetch-repository-stars", fetcher, {
    refreshInterval: 1000 * 60,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return (
    <div
      className={cx(
        "sticky top-0 z-10 flex flex-wrap items-center py-3 -my-3 gap-3 backdrop-blur-sm bg-white/95 md:gap-4 dark:bg-neutral-900/80",
        className
      )}
      {...props}
    >
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
            <>
              {!error && (
                <Badge size="sm" className="-my-0.5 size-auto">
                  {isLoading && <LoaderIcon className="size-3 animate-spin" />}
                  {data && formatter.format(data)}
                </Badge>
              )}
            </>
          }
          asChild
        >
          <a href={GITHUB_URL} target="_blank" rel="nofollow noreferrer">
            Star
            <Ping className="absolute -right-1 -top-1 pointer-events-none" />
          </a>
        </Button>

        <Button
          size="sm"
          variant="secondary"
          prefix={<PlusIcon />}
          className="-my-1.5 max-sm:hidden"
          asChild
        >
          <Link to="/submit" unstable_viewTransition>
            Submit
          </Link>
        </Button>
      </Series>

      {isNavOpen && <Navigation className="mt-2 w-full lg:hidden" showAllLinks />}
    </div>
  )
}
