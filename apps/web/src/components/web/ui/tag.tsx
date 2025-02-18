import { Slot } from "radix-ui"
import type { ComponentProps, ReactNode } from "react"
import { Link } from "~/components/common/link"
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
      className={cx(
        "flex items-center gap-0.5 text-muted-foreground text-sm hover:text-foreground",
        className,
      )}
      {...props}
    >
      {prefix && <Slot.Root className="opacity-30 mr-0.5">{prefix}</Slot.Root>}
      {children}
      {suffix && <Slot.Root className="opacity-30 ml-0.5">{suffix}</Slot.Root>}
    </Link>
  )
}
