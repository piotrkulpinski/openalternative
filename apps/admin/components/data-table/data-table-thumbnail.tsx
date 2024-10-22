import type { ComponentProps } from "react"

import { cx } from "~/utils/cva"

export const DataTableThumbnail = ({ className, ...props }: ComponentProps<"img">) => {
  return (
    <img
      className={cx("inline-block align-text-bottom mr-2 size-4 rounded", className)}
      alt="Thumbnail"
      loading="lazy"
      width={16}
      height={16}
      {...props}
    />
  )
}
