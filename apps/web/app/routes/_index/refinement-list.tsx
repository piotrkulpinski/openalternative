import type { HTMLAttributes } from "react"
import { type UseRefinementListProps, useRefinementList } from "react-instantsearch"
import { Badge } from "~/components/ui/badge"
import { Input } from "~/components/ui/forms/input"
import { H6 } from "~/components/ui/heading"
import { navigationLinkVariants } from "~/components/ui/navigation-link"
import { cx } from "~/utils/cva"

type RefinementListProps = HTMLAttributes<HTMLDivElement> & UseRefinementListProps

export const RefinementList = ({ className, ...props }: RefinementListProps) => {
  const { items, refine, searchForItems, isShowingMore, toggleShowMore, canToggleShowMore } =
    useRefinementList(props)

  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <H6 className="capitalize">{props.attribute}</H6>

      <Input
        type="search"
        size="sm"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={512}
        placeholder={`Search ${props.attribute}`}
        onChange={e => searchForItems(e.currentTarget.value)}
      />

      <div
        className={cx(
          "flex flex-col px-2",
          isShowingMore && "max-h-60 overflow-auto overscroll-contain",
        )}
      >
        {items?.map(item => (
          <label
            key={item.label}
            className="flex items-center gap-2.5 select-none text-[0.8125rem] cursor-pointer text-secondary duration-150 hover:!text-primary"
          >
            <input type="checkbox" checked={item.isRefined} onChange={() => refine(item.value)} />
            <span className="flex-1 truncate">{item.label}</span>
            <Badge size="sm">{item.count}</Badge>
          </label>
        ))}

        {!items.length && <p className="text-xs text-secondary">No results found</p>}
      </div>

      <button
        type="button"
        onClick={toggleShowMore}
        disabled={!canToggleShowMore}
        className={cx("!text-xs", navigationLinkVariants({ className }))}
      >
        {isShowingMore ? "Show less" : "Show more"}
      </button>
    </div>
  )
}
