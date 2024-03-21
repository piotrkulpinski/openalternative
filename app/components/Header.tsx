import { NavLink } from "@remix-run/react"
import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { Logo } from "./Logo"

export const Header = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div className={cx("flex items-center justify-between", className)} {...props}>
      <NavLink to="/" className="group flex shrink-0 items-center gap-2">
        <Logo className="size-5" />

        <p className="text-sm font-medium tracking-tight group-hover:opacity-80">OpenAlternative</p>
      </NavLink>

      {children}
    </div>
  )
}
