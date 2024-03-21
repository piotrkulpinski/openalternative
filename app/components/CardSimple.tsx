import { NavLink, NavLinkProps } from "@remix-run/react"
import { cx } from "~/utils/cva"

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
      <p className="truncate group-hover:underline">{label}</p>
      <span className="h-px flex-1 bg-current opacity-15"></span>
      {caption && <span className="shrink-0 text-xs text-neutral-500">{caption}</span>}
    </NavLink>
  )
}
