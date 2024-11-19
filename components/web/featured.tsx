import type { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

export const Featured = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const featured = [
    {
      name: "Hacker News",
      url: "https://news.ycombinator.com/item?id=39639386",
      icon: "/hackernews.svg",
    },
    {
      name: "Indie Hackers",
      url: "https://www.indiehackers.com/post/how-i-grew-a-side-project-to-100k-unique-visitors-in-7-days-with-0-audience-15d48ea192",
      icon: "/indiehackers.svg",
    },
    {
      name: "Product Hunt",
      url: "https://www.producthunt.com/posts/openalternative",
      icon: "/producthunt.svg",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/steventey/status/1765841867017437599",
      icon: "/twitter.svg",
    },
  ]

  return (
    <div className={cx("space-y-2", className)} {...props}>
      <h4 className="text-[0.625rem] tracking-wide uppercase text-muted">As featured on</h4>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:justify-start md:gap-x-6">
        {featured.map(({ name, url, icon }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="nofollow noreferrer"
            className="flex flex-wrap items-center gap-x-2 text-sm font-medium opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
          >
            <img src={icon} width="24" height="24" alt={name} className="rounded-full" />
            <span className="max-sm:hidden">{name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
