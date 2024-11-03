import { MoveLeftIcon, MoveRightIcon } from "lucide-react"
import type { HTMLAttributes, RefObject } from "react"
import { type UsePaginationProps, usePagination } from "react-instantsearch"
import { PaginationLink } from "~/components/ui/pagination-link"
import { cx } from "~/utils/cva"

type PaginationProps = HTMLAttributes<HTMLElement> &
  UsePaginationProps & {
    containerRef: RefObject<HTMLDivElement>
  }

export const Pagination = ({ className, containerRef, ...props }: PaginationProps) => {
  const {
    pages,
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    canRefine,
    refine,
    createURL,
  } = usePagination(props)

  if (!canRefine) {
    return null
  }

  const refinePage = (e: React.MouseEvent<HTMLElement>, page: number) => {
    e.preventDefault()
    containerRef.current?.scrollIntoView({ behavior: "smooth" })
    refine(page)
  }

  return (
    <nav className={cx("-mt-px flex w-full items-start justify-between md:w-auto", className)}>
      <PaginationLink
        to={createURL(currentRefinement - 1)}
        isDisabled={isFirstPage}
        prefix={<MoveLeftIcon />}
        onClick={e => refinePage(e, currentRefinement - 1)}
        rel="prev"
      >
        prev
      </PaginationLink>

      <p className="text-sm text-muted md:hidden">
        Page {currentRefinement + 1} of {nbPages}
      </p>

      <div className="flex items-center flex-wrap gap-3 max-md:hidden">
        <span className="text-sm text-muted">Page:</span>

        {pages.map(page => (
          <PaginationLink
            key={`page-${page}`}
            to={createURL(page)}
            isActive={currentRefinement === page}
            className="min-w-5 justify-center"
            onClick={e => refinePage(e, page)}
          >
            {page + 1}
          </PaginationLink>
        ))}
      </div>

      <PaginationLink
        to={createURL(currentRefinement + 1)}
        isDisabled={isLastPage}
        suffix={<MoveRightIcon />}
        onClick={e => refinePage(e, currentRefinement + 1)}
        rel="next"
      >
        next
      </PaginationLink>
    </nav>
  )
}
