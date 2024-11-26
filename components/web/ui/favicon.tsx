import Image from "next/image"
import type { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

type FaviconProps = HTMLAttributes<HTMLDivElement> & {
  src: string | null
  title?: string | null
}

export const Favicon = ({ className, src, title, ...props }: FaviconProps) => {
  if (!src) return null

  return (
    <div
      className={cx(
        "flex size-9 items-center justify-center shrink-0 rounded-md border bg-background p-1",
        className,
      )}
      {...props}
    >
      <FaviconImage src={src} title={title} className="size-full" />
    </div>
  )
}

export const FaviconImage = ({ className, src, title, ...props }: FaviconProps) => {
  if (!src) return null

  return (
    <Image
      src={src}
      alt={title ? `A favicon of ${title}` : ""}
      loading="lazy"
      width="64"
      height="64"
      className={cx("aspect-square size-9 rounded-sm", className)}
      {...props}
    />
  )
}
