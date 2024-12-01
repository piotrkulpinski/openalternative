import Image from "next/image"
import Link from "next/link"
import type { HTMLProps } from "react"
import { cx } from "~/utils/cva"

const a = ({ href, ...props }: HTMLProps<HTMLAnchorElement>) => {
  if (typeof href !== "string") {
    throw new TypeError("href is required")
  }

  if (href.startsWith("/")) {
    return <Link href={href} {...props} />
  }

  return <a {...props} href={href} target="_blank" rel="noopener noreferrer nofollow" />
}

const img = ({ className, ...props }: HTMLProps<HTMLImageElement>) => {
  if (typeof props.src !== "string" || typeof props.alt !== "string") {
    throw new TypeError("Image src and alt are required")
  }

  return (
    <Image
      src={props.src}
      alt={props.alt}
      width={1240}
      height={698}
      unoptimized
      className={cx("w-full rounded-lg", className)}
    />
  )
}

export const MDXComponents = { a, img }
