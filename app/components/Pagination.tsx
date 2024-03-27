import { getCurrentPage, getPageLink } from "@curiousleaf/utils"
import { useLocation, useSearchParams } from "@remix-run/react"
import { MoveLeftIcon, MoveRightIcon } from "lucide-react"
import { HTMLAttributes, useMemo } from "react"
import { cx } from "~/utils/cva"
import { PaginationLink } from "./PaginationLink"

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
      <PaginationLink
        to={getPageLink(params, pathname, currentPage - 1)}
        disabled={currentPage <= 1}
        prefix={<MoveLeftIcon />}
        rel="prev"
      >
        previous
      </PaginationLink>

      <PaginationLink
        to={getPageLink(params, pathname, currentPage + 1)}
        disabled={currentPage >= pageCount}
        suffix={<MoveRightIcon />}
        rel="prev"
      >
        next
      </PaginationLink>
    </nav>
  )
}
