import { Link, LinkProps } from "@remix-run/react"
import { cx } from "~/utils/cva"

export const Badge = ({ className, ...props }: LinkProps) => {
  return (
    <Link
      className={cx([
        "relative inline-flex items-center justify-center gap-[0.6ch] px-[0.6em] py-[0.125em] text-[13px]",
        "-tracking-micro rounded border bg-neutral-50 text-center font-medium text-neutral-600 hover:border-neutral-300",
        className,
      ])}
      {...props}
    />
  )
}
