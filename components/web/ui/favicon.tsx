import Image from "next/image"
import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

type FaviconProps = ComponentProps<"div"> & {
  src: string | null
  title?: string | null
}

const Favicon = ({ className, src, title, ...props }: FaviconProps) => {
  if (!src) return null

  return (
    <div
      className={cx(
        "flex size-9 items-center justify-center shrink-0 rounded-md border bg-accent p-1",
        className,
      )}
      {...props}
    >
      <FaviconImage src={src} title={title} className="size-full" />
    </div>
  )
}

type FaviconImageProps = Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
  src: string | null
  title?: string | null
}

const FaviconImage = ({ className, src, title, ...props }: FaviconImageProps) => {
  if (!src) return null

  return (
    <Image
      src={src}
      alt={title ? `A favicon of ${title}` : ""}
      loading="lazy"
      width="64"
      height="64"
      className={cx("aspect-square size-9 rounded-sm bg-accent", className)}
      {...props}
    />
  )
}

export { Favicon, FaviconImage }
