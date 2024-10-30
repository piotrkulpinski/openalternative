import Link from "next/link"
import type { ComponentProps } from "react"

import { cx } from "~/utils/cva"

export const DataTableLink = ({ className, ...props }: ComponentProps<typeof Link>) => {
  return (
    <Link
      className={cx(
        "w-40 truncate font-medium text-primary underline underline-offset-4 decoration-foreground/10 hover:decoration-foreground/25",
        className,
      )}
      {...props}
    />
  )
}
