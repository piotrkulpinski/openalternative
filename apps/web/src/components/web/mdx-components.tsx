import { ArrowUpRightIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { HTMLProps } from "react"
import { cx } from "~/utils/cva"

const a = ({ href, ...props }: HTMLProps<HTMLAnchorElement>) => {
  if (typeof href !== "string") {
    return <div {...(props as HTMLProps<HTMLDivElement>)} />
  }

  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link href={href} prefetch={false} {...props} />
  }

  return (
    <a {...props} href={href} target="_blank" rel="noopener noreferrer nofollow">
      {props.children}
      <ArrowUpRightIcon className="inline-block ml-0.5 mb-0.5 size-3.5 stroke-2" />
    </a>
  )
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
      loading="lazy"
      className={cx("w-full rounded-lg", className)}
    />
  )
}

export const MDXComponents = { a, img }
