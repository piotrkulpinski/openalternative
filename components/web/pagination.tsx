"use client"

import { getCurrentPage, getPageLink } from "@curiousleaf/utils"
import { usePathname, useSearchParams } from "next/navigation"
import { type ComponentProps, useMemo } from "react"
import { Note } from "~/components/common/note"
import { PaginationLink } from "~/components/web/pagination-link"
import { navLinkVariants } from "~/components/web/ui/nav-link"
import { type UsePaginationProps, usePagination } from "~/hooks/use-pagination"
import { cx } from "~/utils/cva"
import { Icon } from "../common/icon"

export type PaginationProps = ComponentProps<"nav"> & Omit<UsePaginationProps, "currentPage">

export const Pagination = ({
  className,
  totalCount,
  pageSize = 1,
  siblingCount,
  ...props
}: PaginationProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const currentPage = useMemo(() => getCurrentPage(params.get("page")), [params])
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

  return (
    <nav
      className={cx("-mt-px flex w-full items-start justify-between md:w-auto", className)}
      {...props}
    >
      <PaginationLink
        href={getPageLink(params, pathname, currentPage - 1)}
        isDisabled={currentPage <= 1}
        prefix={<Icon name="lucide/arrow-left" />}
        rel="prev"
      >
        Prev
      </PaginationLink>

      <Note className="md:hidden">
        Page {currentPage} of {pageCount}
      </Note>

      <div className="flex items-center flex-wrap gap-3 max-md:hidden">
        <Note>Page:</Note>

        {paginationRange.map((page, index) => (
          <div key={`page-${index}`}>
            {typeof page === "string" && <span className={navLinkVariants()}>{page}</span>}

            {typeof page === "number" && (
              <PaginationLink
                href={getPageLink(params, pathname, page)}
                isActive={currentPage === page}
                className="min-w-5 justify-center"
              >
                {page}
              </PaginationLink>
            )}
          </div>
        ))}
      </div>

      <PaginationLink
        href={getPageLink(params, pathname, currentPage + 1)}
        isDisabled={currentPage >= pageCount}
        suffix={<Icon name="lucide/arrow-right" />}
        rel="prev"
      >
        Next
      </PaginationLink>
    </nav>
  )
}
