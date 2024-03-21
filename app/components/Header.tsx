import { Link, NavLink } from "@remix-run/react"
import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { Logo } from "./Logo"
import { Button } from "./Button"
import { PlusIcon } from "lucide-react"
import { H6 } from "./Heading"

export const Header = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div className={cx("flex items-center justify-between gap-3 md:gap-4", className)} {...props}>
      <NavLink to="/" className="group flex shrink-0 items-center gap-2">
        <Logo className="size-5" />

        <H6 asChild>
          <span className="group-hover:opacity-80">OpenAlternative</span>
        </H6>
      </NavLink>

      {children}

      <Button size="sm" variant="outline" prefix={<PlusIcon />} className="-my-1.5" asChild>
        <Link to="/submit">Submit Tool</Link>
      </Button>
    </div>
  )
}
