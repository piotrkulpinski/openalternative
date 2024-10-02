import { formatNumber } from "@curiousleaf/utils"
import type { HTMLAttributes } from "react"
import { SITE_STATS } from "~/utils/constants"
import { cx } from "~/utils/cva"

export const NewsletterProof = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={cx(
        "flex flex-wrap items-center justify-center text-center gap-y-1 -space-x-1.5",
        className,
      )}
      {...props}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <img
          key={index}
          src={`/users/${index + 1}.jpg`}
          alt=""
          width="40"
          height="40"
          className="size-7 border-2 border-card rounded-full"
        />
      ))}

      <p className="w-full text-xs text-muted">
        Join {formatNumber(SITE_STATS.subscribers, "standard")}+ open source enthusiasts
      </p>
    </div>
  )
}
