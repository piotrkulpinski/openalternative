import { NavLink, type NavLinkProps } from "@remix-run/react"
import { cx } from "cva"
import { HTMLAttributes } from "react"

type CardProps = HTMLAttributes<HTMLElement> &
  NavLinkProps & {
    name: string
    description?: string | null
    website: string | null
    isFeatured?: boolean
  }

export const Card = ({ ...props }: CardProps) => {
  const { children, className, name, description, website, isFeatured, ...rest } = props

  return (
    <NavLink
      className={cx(
        "group relative flex flex-col overflow-clip rounded-md border bg-neutral-50 hover:border-neutral-300 dark:border-neutral-700/50 dark:bg-neutral-800/40 dark:hover:border-neutral-700",
        className
      )}
      {...rest}
    >
      <div className="relative z-10 flex flex-1 flex-col items-start gap-4 border-t p-5 first:border-t-0">
        <div className="flex w-full flex-row flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex size-9 items-center justify-center rounded-md bg-white p-1 shadow-md shadow-neutral-800/5 ring-1 ring-neutral-900/5 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-700/50">
            <img
              alt=""
              loading="eager"
              width="64"
              height="64"
              decoding="async"
              data-nimg="1"
              className="aspect-square size-full rounded"
              src={`https://www.google.com/s2/favicons?sz=128&domain_url=${website}`}
            />
          </div>
          <h4 className="text-lg font-semibold">{name}</h4>

          {isFeatured && (
            <div className="ml-auto rounded border bg-neutral-200/60 px-1 py-px text-xs">Ad</div>
          )}
        </div>

        <p className="-tracking-0.5 line-clamp-2 text-sm/normal text-neutral-500">{description}</p>

        {children}
      </div>

      <div className="dotted absolute inset-0 z-0 dark:invert" />
    </NavLink>
  )
}
