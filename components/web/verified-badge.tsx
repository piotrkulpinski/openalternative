import Image from "next/image"
import type { ComponentProps } from "react"
import VerifiedBadgeIcon from "~/assets/verified-badge.svg"
import { Tooltip } from "~/components/common/tooltip"
import { cx } from "~/utils/cva"

type VerifiedBadgeProps = Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
  size?: "sm" | "md" | "lg"
}

export const VerifiedBadge = ({ className, size = "md", ...props }: VerifiedBadgeProps) => {
  return (
    <Tooltip tooltip="Verified">
      <Image
        src={VerifiedBadgeIcon}
        alt="Verified"
        className={cx(
          "-ml-1",
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
