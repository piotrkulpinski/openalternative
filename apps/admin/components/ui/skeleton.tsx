import { cx } from "~/utils/cva"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("animate-pulse rounded-md bg-foreground/5", className)} {...props} />
}

export { Skeleton }
