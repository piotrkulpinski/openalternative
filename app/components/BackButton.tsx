import { Link, LinkProps } from "@remix-run/react"
import { cx } from "~/utils/cva"

export const BackButton = ({ className, ...props }: LinkProps) => {
  return (
    <Link
      className={cx(
        "peer mt-auto self-start text-sm text-neutral-600 hover:text-inherit dark:text-neutral-400",
        className
      )}
      unstable_viewTransition
      {...props}
    >
      ⟵ back
    </Link>
  )
}
