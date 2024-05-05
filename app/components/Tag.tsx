import { Link, type LinkProps } from "@remix-run/react"
import { cx } from "~/utils/cva"

export const Tag = ({ className, ...props }: LinkProps) => {
  return (
    <Link
      className={cx([
        "relative inline-flex items-center justify-center gap-[0.6ch] px-[0.6em] py-[0.125em] text-[13px]",
        "-tracking-micro rounded border bg-card text-center font-medium text-secondary hover:bg-card-dark hover:border-border-dark",
        className,
      ])}
      unstable_viewTransition
      {...props}
    />
  )
}
