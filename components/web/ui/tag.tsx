import { Slot } from "@radix-ui/react-slot"
import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"
import { cx } from "~/utils/cva"

type TagProps = Omit<ComponentProps<typeof Link>, "prefix"> & {
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
      prefetch={false}
      className={cx(
        "flex items-center gap-0.5 text-muted text-sm hover:text-foreground",
        className,
      )}
      {...props}
    >
      {prefix && <Slot className="opacity-30 mr-0.5">{prefix}</Slot>}
      {children}
      {suffix && <Slot className="opacity-30 ml-0.5">{suffix}</Slot>}
    </Link>
  )
}
