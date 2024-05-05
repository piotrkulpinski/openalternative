import { NavLink, type NavLinkProps } from "@remix-run/react"
import type { ReactNode } from "react"
import { cx } from "~/utils/cva"
import { H5 } from "./Heading"

type CardSimpleProps = NavLinkProps & {
  label: ReactNode
  caption?: ReactNode
}

export const CardSimple = ({ ...props }: CardSimpleProps) => {
  const { className, label, caption, ...rest } = props

  return (
    <NavLink
      className={cx("fade-in group -my-2 flex min-w-0 items-center gap-4 py-2", className)}
      unstable_viewTransition
      {...rest}
    >
      <H5 as="h3" className="truncate group-hover:underline">
        {label}
      </H5>

      <span className="h-px flex-1 bg-current opacity-15" />
      {caption && <span className="shrink-0 text-xs text-secondary">{caption}</span>}
    </NavLink>
  )
}
