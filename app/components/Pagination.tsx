import { getCurrentPage } from "@curiousleaf/utils"
import { useLocation } from "@remix-run/react"
import { MoveLeftIcon, MoveRightIcon } from "lucide-react"
import { HTMLAttributes, useMemo } from "react"
import { cx } from "~/utils/cva"
import { PaginationLink } from "./PaginationLink"
import { UsePaginationProps, usePagination } from "~/hooks/usePagination"
import { navigationLinkVariants } from "./NavigationLink"
import queryString from "query-string"

export type PaginationProps = HTMLAttributes<HTMLElement> & Omit<UsePaginationProps, "currentPage">

export const Pagination = ({
  className,
  totalCount,
  pageSize = 1,
  siblingCount,
  ...props
}: PaginationProps) => {
  const { pathname } = useLocation()
  const params = queryString.parse(window.location.search)
  const currentPage = useMemo(() => getCurrentPage(params.page as string), [params])
  const pageCount = Math.ceil(totalCount / pageSize)

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    pageSize,
    siblingCount,
  })

  if (paginationRange.length <= 1) {
    return null
  }

  const getPageLink = (params: Record<string, unknown>, pathname: string, page: number) => {
    params.page = page.toString()
    return `${pathname}?${queryString.stringify(params)}`
  }

  return (
    <nav
      className={cx("-mt-px flex w-full items-start justify-between md:w-auto", className)}
      {...props}
    >
      <PaginationLink
        to={getPageLink(params, pathname, currentPage - 1)}
        isDisabled={currentPage <= 1}
        prefix={<MoveLeftIcon />}
        rel="prev"
      >
        prev
      </PaginationLink>

      <p className="text-sm text-neutral-500 md:hidden">
        Page {currentPage} of {pageCount}
      </p>

      <div className="flex items-center flex-wrap gap-3 max-md:hidden">
        <span className="text-sm text-neutral-500">Page:</span>

        {paginationRange.map((page, index) => (
          <div key={`page-${index}`}>
            {typeof page === "string" && <span className={navigationLinkVariants()}>{page}</span>}

            {typeof page === "number" && (
              <PaginationLink
                to={getPageLink(params, pathname, page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            )}
          </div>
        ))}
      </div>

      <PaginationLink
        to={getPageLink(params, pathname, currentPage + 1)}
        isDisabled={currentPage >= pageCount}
        suffix={<MoveRightIcon />}
        rel="prev"
      >
        next
      </PaginationLink>
    </nav>
  )
}
