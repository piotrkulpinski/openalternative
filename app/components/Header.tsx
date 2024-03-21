import { NavLink } from "@remix-run/react"
import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

export const Header = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div className={cx("flex items-center justify-between", className)} {...props}>
      <NavLink to="/" className="group flex shrink-0 items-center gap-2">
        <img
          className="inline-block h-6 w-6"
          src="/logo.webp"
          alt=""
          height="128"
          width="128"
          loading="eager"
        />

        <p className="text-sm font-medium group-hover:opacity-80">OpenAlternative</p>
      </NavLink>

      {children}
    </div>
  )
}
