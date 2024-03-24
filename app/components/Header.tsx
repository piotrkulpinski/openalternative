import { Link } from "@remix-run/react"
import { HTMLAttributes, useState } from "react"
import { cx } from "~/utils/cva"
import { Button } from "./Button"
import { MenuIcon, PlusIcon } from "lucide-react"
import { Navigation } from "./Navigation"
import { Breadcrumbs } from "./Breadcrumbs"

export const Header = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const [isNavOpen, setNavOpen] = useState(false)

  return (
    <>
      <div className={cx("flex items-center gap-3 md:gap-4", className)} {...props}>
        <button type="button" onClick={() => setNavOpen(!isNavOpen)} className="lg:hidden">
          <MenuIcon className="size-6 stroke-[1.5]" />
        </button>

        <Breadcrumbs className="mr-auto" />

        <Navigation className="max-lg:hidden" />

        <Button size="sm" variant="secondary" prefix={<PlusIcon />} className="-my-1.5" asChild>
          <Link to="/submit">Submit</Link>
        </Button>
      </div>

      {isNavOpen && <Navigation className="lg:hidden" />}
    </>
  )
}
