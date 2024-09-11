import { Link, type NavLinkProps, type UIMatch, useMatches } from "@remix-run/react"
import { Fragment, type HTMLAttributes, type ReactNode } from "react"
import { cx } from "~/utils/cva"

type BreadcrumbsItemProps = HTMLAttributes<HTMLElement> &
  NavLinkProps & {
    label: ReactNode
  }

export const BreadcrumbsLink = ({ children, label, ...props }: BreadcrumbsItemProps) => {
  return (
    <Link
      itemProp="item"
      className={cx([
        "flex items-center gap-2 p-0.5 -m-0.5 text-sm -tracking-micro cursor-pointer",
        "text-muted disabled:opacity-50 hover:text-foreground",
        "group-last:group-[&:not(:only-child)]:line-clamp-1",
        "group-first:font-medium group-first:text-foreground",
      ])}
      unstable_viewTransition
      {...props}
    >
      {children}

      <span itemProp="name">{label}</span>
    </Link>
  )
}

const BreadcrumbsSeparator = ({ ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <span className="text-sm text-secondary invert pointer-events-none select-none" {...props}>
      /
    </span>
  )
}

type BreadcrumbMatch = UIMatch<
  Record<string, unknown>,
  { breadcrumb: (data?: unknown) => JSX.Element }
>

export const Breadcrumbs = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const matches = (useMatches() as unknown as BreadcrumbMatch[]).filter(
    ({ handle }) => handle?.breadcrumb,
  )

  return (
    <ol
      itemScope
      itemType="https://schema.org/BreadcrumbList"
      className={cx("flex items-center gap-2", className)}
      {...props}
    >
      {matches.map(({ handle, data }, i) => (
        <Fragment key={i}>
          <li
            className={cx("group contents", i > 0 && "max-md:hidden")}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {i > 0 && <BreadcrumbsSeparator />}
            {handle.breadcrumb(data)}
            <meta itemProp="position" content={`${i + 1}`} />
          </li>
        </Fragment>
      ))}
    </ol>
  )
}
