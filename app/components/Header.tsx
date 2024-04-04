import { Link } from "@remix-run/react"
import { HTMLAttributes, useState } from "react"
import { cx } from "~/utils/cva"
import { Button } from "./Button"
import { MenuIcon, PlusIcon, XIcon } from "lucide-react"
import { Navigation } from "./Navigation"
import { Breadcrumbs } from "./Breadcrumbs"
import { ThemeSwitcher } from "./ThemeSwitcher"
import { Series } from "./Series"

export const Header = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const [isNavOpen, setNavOpen] = useState(false)

  return (
    <div className={cx("flex flex-wrap items-center gap-3 md:gap-4", className)} {...props}>
      <button type="button" onClick={() => setNavOpen(!isNavOpen)} className="lg:hidden">
        <MenuIcon className={cx("size-6 stroke-[1.5]", isNavOpen && "hidden")} />
        <XIcon className={cx("size-6 stroke-[1.5]", !isNavOpen && "hidden")} />
      </button>

      <Breadcrumbs className="mr-auto" />

      <Navigation className="max-lg:hidden" />

      <Series size="sm">
        <Button size="sm" variant="secondary" prefix={<PlusIcon />} className="-my-1.5" asChild>
          <Link to="/submit" unstable_viewTransition>
            Submit
          </Link>
        </Button>

        <ThemeSwitcher />
      </Series>

      {isNavOpen && <Navigation className="mt-2 w-full lg:hidden" showAllLinks />}
    </div>
  )
}
