import type { HTMLAttributes } from "react"
import { config } from "~/config"
import { cx } from "~/utils/cva"

export const Featured = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div className={cx("space-y-2", className)} {...props}>
      <h4 className="text-[0.625rem] tracking-wide uppercase text-muted">As featured on</h4>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:justify-start md:gap-x-6">
        {config.links.featured.map(({ name, url, icon }) => (
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
