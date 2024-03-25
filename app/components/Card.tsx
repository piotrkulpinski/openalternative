import { NavLink, type NavLinkProps } from "@remix-run/react"
import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { Favicon } from "./Favicon"
import { H3 } from "./Heading"

type CardProps = HTMLAttributes<HTMLElement> &
  NavLinkProps & {
    name: string
    description?: string | null
    faviconUrl: string | null
    isFeatured?: boolean
  }

export const Card = ({ ...props }: CardProps) => {
  const { children, className, name, description, faviconUrl, isFeatured, ...rest } = props

  return (
    <NavLink
      className={cx(
        "relative flex flex-col items-start gap-4 overflow-clip rounded-md border bg-neutral-50 p-5 hover:border-neutral-300 dark:border-neutral-700/50 dark:bg-neutral-800/40 dark:hover:border-neutral-700",
        className
      )}
      {...rest}
    >
      <div className="flex w-full items-center gap-x-3 gap-y-2">
        <Favicon src={faviconUrl} />

        <H3 className="truncate">{name}</H3>

        {isFeatured && (
          <div className="ml-auto rounded bg-neutral-200/60 px-1.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-700/60 dark:text-neutral-200">
            Promoted
          </div>
        )}
      </div>

      <p className="-tracking-0.5 line-clamp-2 text-sm/normal text-neutral-500">{description}</p>

      {children}
    </NavLink>
  )
}
