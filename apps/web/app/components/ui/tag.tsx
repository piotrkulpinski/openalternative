import { Slot } from "@radix-ui/react-slot"
import { Link, type LinkProps } from "@remix-run/react"
import type { ReactNode } from "react"
import { cx } from "~/utils/cva"

type TagProps = Omit<LinkProps, "prefix"> & {
  /**
   * The slot to be rendered before the label.
   */
  prefix?: ReactNode

  /**
   * The slot to be rendered after the label.
   */
  suffix?: ReactNode
}

export const Tag = ({ children, className, prefix, suffix, ...props }: TagProps) => {
  return (
    <Link
      className={cx(
        "flex items-center gap-0.5 text-secondary text-sm hover:text-foreground",
        className,
      )}
      unstable_viewTransition
      {...props}
    >
      {prefix && <Slot className="opacity-30 mr-0.5">{prefix}</Slot>}
      {children}
      {suffix && <Slot className="opacity-30 ml-0.5">{suffix}</Slot>}
    </Link>
  )
}
