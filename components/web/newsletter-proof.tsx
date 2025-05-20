import { formatNumber } from "@curiousleaf/utils"
import Image from "next/image"
import type { ComponentProps } from "react"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { config } from "~/config"
import { cx } from "~/utils/cva"

export const NewsletterProof = ({ className, ...props }: ComponentProps<typeof Stack>) => {
  return (
    <Stack size="sm" className={cx("text-center", className)} {...props}>
      <div className="flex flex-wrap items-center justify-center -space-x-1.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Image
            key={index}
            src={`/users/${index + 1}.webp`}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            className="size-7 border-2 border-card rounded-full"
          />
        ))}
      </div>

      <Note className="text-xs">
        Join {formatNumber(config.stats.subscribers + config.stats.stars, "compact")}+ people
      </Note>
    </Stack>
  )
}
