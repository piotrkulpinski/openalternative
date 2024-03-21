import { NavLink, NavLinkProps } from "@remix-run/react"
import { cx } from "~/utils/cva"
import { H5 } from "./Heading"

type CardSimpleProps = NavLinkProps & {
  label: string
  caption?: string
}

export const CardSimple = ({ ...props }: CardSimpleProps) => {
  const { className, label, caption, ...rest } = props

  return (
    <NavLink
      className={cx("group -my-2 flex min-w-0 items-center gap-4 py-2", className)}
      {...rest}
    >
      <H5 className="truncate group-hover:underline" asChild>
        <h3>{label}</h3>
      </H5>
      <span className="h-px flex-1 bg-current opacity-15"></span>
      {caption && <span className="shrink-0 text-xs text-neutral-500">{caption}</span>}
    </NavLink>
  )
}
