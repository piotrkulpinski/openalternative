import type { HTMLAttributes } from "react"
import { type UseRefinementListProps, useRefinementList } from "react-instantsearch"
import { Badge } from "~/components/Badge"
import { H6 } from "~/components/Heading"
import { navigationLinkVariants } from "~/components/NavigationLink"
import { Input } from "~/components/forms/Input"
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
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={512}
        placeholder={`Search ${props.attribute}`}
        onChange={e => searchForItems(e.currentTarget.value)}
        className="!text-xs !min-w-[0] px-2 py-1 font-normal outline-offset-0"
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
            className="flex items-center gap-2.5 select-none text-[13px] cursor-pointer text-secondary hover:!text-pink-500"
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
