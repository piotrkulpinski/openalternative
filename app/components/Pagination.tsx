import { getCurrentPage, getPageLink } from "@curiousleaf/utils"
import { NavLink, useLocation, useSearchParams } from "@remix-run/react"
import { MoveLeftIcon, MoveRightIcon } from "lucide-react"
import { HTMLAttributes, useMemo } from "react"
import { cx } from "~/utils/cva"
import { navigationLinkVariants } from "./NavigationLink"

export type PaginationProps = HTMLAttributes<HTMLElement> & {
  totalCount: number
  pageSize?: number
  siblingCount?: number
}

export const Pagination = ({ className, totalCount, pageSize = 0, ...props }: PaginationProps) => {
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const currentPage = useMemo(() => getCurrentPage(params.get("page")), [params])
  const pageCount = Math.ceil(totalCount / pageSize)

  if (pageCount <= 1) {
    return null
  }

  return (
    <nav
      className={cx("-mt-px flex w-full items-start justify-between md:w-auto", className)}
      {...props}
    >
      <NavLink
        to={getPageLink(params, pathname, currentPage - 1)}
        className={cx(
          navigationLinkVariants({
            className: currentPage <= 1 && "pointer-events-none select-none opacity-40",
          })
        )}
        unstable_viewTransition
        rel="prev"
      >
        <MoveLeftIcon className="size-5" />
        <span className="max-md:sr-only">Previous</span>
      </NavLink>

      <NavLink
        to={getPageLink(params, pathname, currentPage + 1)}
        className={cx(
          navigationLinkVariants({
            className: currentPage >= pageCount && "pointer-events-none select-none opacity-40",
          })
        )}
        unstable_viewTransition
        rel="next"
      >
        <span className="max-md:sr-only">Next</span>
        <MoveRightIcon className="size-5" />
      </NavLink>
    </nav>
  )
}
