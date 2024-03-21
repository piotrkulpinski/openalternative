import { cx } from "cva"
import { HTMLAttributes } from "react"

type FaviconProps = HTMLAttributes<HTMLDivElement> & {
  url: string | null
}

export const Favicon = ({ className, url, ...props }: FaviconProps) => {
  if (!url) return null

  return (
    <div
      className={cx(
        "flex size-9 items-center justify-center rounded-md bg-white p-1 shadow-md shadow-neutral-800/5 ring-1 ring-neutral-900/5 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-700/50",
        className
      )}
      {...props}
    >
      <img
        alt=""
        loading="eager"
        width="64"
        height="64"
        decoding="async"
        data-nimg="1"
        className="aspect-square size-full rounded"
        src={`https://www.google.com/s2/favicons?sz=128&domain_url=${url}`}
      />
    </div>
  )
}
