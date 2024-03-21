import { NavLink, type NavLinkProps } from "@remix-run/react"
import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { Favicon } from "./Favicon"

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
        "group relative flex flex-col items-start gap-4 overflow-clip rounded-md border bg-neutral-50 p-5 hover:border-neutral-300 dark:border-neutral-700/50 dark:bg-neutral-800/40 dark:hover:border-neutral-700",
        className
      )}
      {...rest}
    >
      <div className="flex w-full flex-row flex-wrap items-center gap-x-3 gap-y-2">
        <Favicon url={website} />

        <h3 className="text-lg font-semibold">{name}</h3>

        {isFeatured && (
          <div className="ml-auto rounded border bg-neutral-200/60 px-1 py-px text-xs">Ad</div>
        )}
      </div>

      <p className="-tracking-0.5 line-clamp-2 text-sm/normal text-neutral-500">{description}</p>

      {children}
    </NavLink>
  )
}
