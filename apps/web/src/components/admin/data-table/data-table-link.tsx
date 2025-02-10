import type { ComponentProps } from "react"
import { Link } from "~/components/common/link"

import { cx } from "~/utils/cva"

export const DataTableLink = ({ className, ...props }: ComponentProps<typeof Link>) => {
  return (
    <Link
      className={cx(
        "block w-40 truncate font-medium underline underline-offset-4 decoration-foreground/10 hover:decoration-foreground/25",
        className,
      )}
      {...props}
    />
  )
}
