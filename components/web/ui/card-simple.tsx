import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"
import { H5 } from "~/components/common/heading"
import { cx } from "~/utils/cva"

type CardSimpleProps = ComponentProps<typeof Link> & {
  label: ReactNode
  caption?: ReactNode
}

export const CardSimple = ({ className, label, caption, ...props }: CardSimpleProps) => {
  return (
    <Link
      className={cx("fade-in group -my-2 flex min-w-0 items-center gap-4 py-2", className)}
      {...props}
    >
      <H5 as="h3" className="truncate group-hover:underline">
        {label}
      </H5>

      <hr className="min-w-2 flex-1" />
      {caption && <span className="shrink-0 text-xs text-secondary">{caption}</span>}
    </Link>
  )
}
