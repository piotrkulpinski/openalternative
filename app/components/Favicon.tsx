import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

type FaviconProps = HTMLAttributes<HTMLDivElement> & {
  src: string | null
}

export const Favicon = ({ className, src, ...props }: FaviconProps) => {
  if (!src) return null

  return (
    <div
      className={cx(
        "flex size-9 items-center justify-center rounded-md border bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900",
        className
      )}
      {...props}
    >
      <FaviconImage src={src} className="size-full" />
    </div>
  )
}

export const FaviconImage = ({ className, src, ...props }: FaviconProps) => {
  if (!src) return null

  return (
    <img
      alt=""
      loading="eager"
      width="64"
      height="64"
      className={cx("aspect-square size-9 rounded", className)}
      src={src}
      {...props}
    />
  )
}
