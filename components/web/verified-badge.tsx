import type { ComponentProps } from "react"
import { Icon } from "~/components/common/icon"
import { Tooltip } from "~/components/common/tooltip"
import { cx } from "~/utils/cva"

type VerifiedBadgeProps = Omit<ComponentProps<typeof Icon>, "name"> & {
  size?: "sm" | "md" | "lg"
}

export const VerifiedBadge = ({ className, size = "md", ...props }: VerifiedBadgeProps) => {
  return (
    <Tooltip tooltip="Verified">
      <Icon
        name="verified-badge"
        className={cx(
          "-ml-1 stroke-0",
          size === "sm" && "-mb-[0.15em] size-4",
          size === "md" && "-mb-[0.2em] size-5",
          size === "lg" && "-mb-[0.25em] size-6",
          className,
        )}
        {...props}
      />
    </Tooltip>
  )
}
