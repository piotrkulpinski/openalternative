import { type ComponentProps, Fragment, type ReactNode, useState } from "react"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"

type ShowMoreProps<T> = ComponentProps<typeof Stack> & {
  items: T[]
  limit?: number
  buffer?: number
  showMoreType?: "link" | "text" | "none"
  renderItem: (item: T) => ReactNode
}

export const ShowMore = <T,>({
  items,
  limit = 4,
  buffer = 1,
  showMoreType = "link",
  renderItem,
  ...props
}: ShowMoreProps<T>) => {
  const [showAll, setShowAll] = useState(false)

  const shouldShowAll = showAll || items.length <= limit + buffer
  const visibleItems = shouldShowAll ? items : items.slice(0, limit)
  const hiddenCount = items.length - limit

  if (!items.length) return null

  return (
    <Stack {...props}>
      {visibleItems.map((item, index) => (
        <Fragment key={index}>{renderItem(item)}</Fragment>
      ))}

      {!shouldShowAll && hiddenCount > 0 && (
        <>
          {showMoreType === "link" && (
            <button
              type="button"
              className="font-medium text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setShowAll(true)}
            >
              +{hiddenCount} more
            </button>
          )}

          {showMoreType === "text" && <Note>+{hiddenCount} more</Note>}
        </>
      )}
    </Stack>
  )
}
