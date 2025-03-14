import { BadgeCheckIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { Tooltip } from "~/components/common/tooltip"
import { cx } from "~/utils/cva"

type VerifiedBadgeProps = ComponentProps<typeof BadgeCheckIcon> & {
  size?: "sm" | "md" | "lg"
}

export const VerifiedBadge = ({ className, size = "md", ...props }: VerifiedBadgeProps) => {
  return (
    <Tooltip tooltip="Verified">
      <BadgeCheckIcon
        className={cx(
          "-ml-1 fill-blue-500 stroke-background",
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
