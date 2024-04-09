import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { H6 } from "~/components/Heading"
import { Badge } from "~/components/Badge"
import { useRefinementList, type UseRefinementListProps } from "react-instantsearch"
import { navigationLinkVariants } from "~/components/NavigationLink"
import { Input } from "~/components/forms/Input"

type RefinementListProps = HTMLAttributes<HTMLDivElement> & UseRefinementListProps

export const RefinementList = ({ className, ...props }: RefinementListProps) => {
  const { items, refine, searchForItems, isShowingMore, toggleShowMore, canToggleShowMore } =
    useRefinementList(props)

  return (
    <div className={cx("flex flex-col gap-2 flex-1 basis-1/5 min-w-0", className)}>
      <H6 className="capitalize">{props.attribute}</H6>

      {isShowingMore && (
        <Input
          type="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={512}
          placeholder={`Search`}
          onChange={(e) => searchForItems(e.currentTarget.value)}
          className="!text-xs !min-w-[0] px-2 py-1"
        />
      )}

      <div
        className={cx(
          "flex flex-col px-1.5",
          isShowingMore && "max-h-64 overflow-auto overscroll-contain"
        )}
      >
        {items?.map((item) => (
          <label
            key={item.label}
            className="flex items-center gap-2.5 select-none text-[13px] cursor-pointer text-neutral-600 hover:text-pink-600"
          >
            <input
              type="checkbox"
              checked={item.isRefined}
              onChange={() => refine(item.value)}
              className="border-neutral-200"
            />
            <span className="flex-1 truncate">{item.label}</span>
            <Badge size="sm">{item.count}</Badge>
          </label>
        ))}

        {!items.length && <p className="text-xs text-neutral-500">No results found</p>}
      </div>

      <button
        onClick={toggleShowMore}
        disabled={!canToggleShowMore}
        className={cx("!text-xs !ml-1", navigationLinkVariants({ className }))}
      >
        {isShowingMore ? "Show less" : "Show more"}
      </button>
    </div>
  )
}
