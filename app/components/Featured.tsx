import { cx } from "cva"
import { HTMLAttributes } from "react"

export const Featured = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div className={cx("space-y-2", className)} {...props}>
      <h4 className="text-[10px] uppercase text-gray-500">Featured on</h4>

      <div className="flex flex-wrap items-center gap-x-4 md:gap-x-6">
        <a
          href="https://www.producthunt.com/posts/openalternative"
          target="_blank"
          rel="nofollow noreferrer"
          className="flex flex-wrap items-center gap-x-2 text-sm font-medium opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
        >
          <img
            src="/producthunt.svg"
            width="24"
            height="24"
            alt="Product Hunt"
            className="rounded-full"
          />
          Product Hunt
        </a>

        <a
          href="https://news.ycombinator.com/item?id=39639386"
          target="_blank"
          rel="nofollow noreferrer"
          className="flex flex-wrap items-center gap-x-2 text-sm font-medium opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
        >
          <img
            src="/hackernews.svg"
            width="24"
            height="24"
            alt="Hacker News"
            className="rounded-full"
          />
          Hacker News
        </a>

        <a
          href="https://twitter.com/steventey/status/1765841867017437599"
          target="_blank"
          rel="nofollow noreferrer"
          className="flex flex-wrap items-center gap-x-2 text-sm font-medium opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
        >
          <img src="/twitter.svg" width="24" height="24" alt="Twitter" className="rounded-full" />
          Twitter
        </a>
      </div>
    </div>
  )
}
