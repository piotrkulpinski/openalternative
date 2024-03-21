import { Link, NavLink } from "@remix-run/react"
import { HTMLAttributes, useState } from "react"
import { cx } from "~/utils/cva"
import { Logo } from "./Logo"
import { Button } from "./Button"
import { MenuIcon, PlusIcon } from "lucide-react"
import { H6 } from "./Heading"
import { Navigation } from "./Navigation"

export const Header = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const [isNavOpen, setNavOpen] = useState(false)

  return (
    <>
      <div className={cx("flex items-center gap-3 md:gap-4", className)} {...props}>
        <button type="button" onClick={() => setNavOpen(!isNavOpen)} className="md:hidden">
          <MenuIcon className="size-6" />
        </button>

        <NavLink to="/" className="group mr-auto flex shrink-0 items-center gap-2">
          <Logo className="size-5" />

          <H6 asChild>
            <span className="group-hover:opacity-80">OpenAlternative</span>
          </H6>
        </NavLink>

        <Navigation className="max-lg:hidden" />

        <Button size="sm" variant="outline" prefix={<PlusIcon />} className="-my-1.5" asChild>
          <Link to="/submit">Submit Tool</Link>
        </Button>
      </div>

      {isNavOpen && <Navigation className="lg:hidden" />}
    </>
  )
}
