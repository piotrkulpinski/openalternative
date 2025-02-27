import Image from "next/image"
import type { ComponentProps } from "react"

import { cx } from "~/utils/cva"

export const DataTableThumbnail = ({
  className,
  ...props
}: Omit<ComponentProps<typeof Image>, "alt">) => {
  return (
    <Image
      className={cx("inline-block align-text-bottom mr-2 size-4 rounded", className)}
      alt="Thumbnail"
      loading="lazy"
      width="64"
      height="64"
      {...props}
    />
  )
}
