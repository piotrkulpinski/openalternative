import { NavLink, type NavLinkProps } from "@remix-run/react"
import type { ReactNode } from "react"
import { H5 } from "~/components/ui/heading"
import { cx } from "~/utils/cva"

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

      <hr className="min-w-2 flex-1" />
      {caption && <span className="shrink-0 text-xs text-secondary">{caption}</span>}
    </NavLink>
  )
}
