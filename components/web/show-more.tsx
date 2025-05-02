import { type ComponentProps, useState } from "react"
import { Button } from "~/components/common/button"
import { Stack } from "~/components/common/stack"

type ShowMoreProps<T> = ComponentProps<typeof Stack> & {
  items: T[]
  limit?: number
  renderItem: (item: T) => React.ReactNode
}

export const ShowMore = <T,>({
  items,
  limit = 4,
  renderItem,
  className,
  ...props
}: ShowMoreProps<T>) => {
  const [showAll, setShowAll] = useState(false)

  const shouldShowAll = showAll || items.length <= limit + 1
  const visibleItems = shouldShowAll ? items : items.slice(0, limit)
  const hiddenCount = items.length - limit

  if (!items.length) return null

  return (
    <Stack {...props}>
      {visibleItems.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}

      {!shouldShowAll && hiddenCount > 0 && (
        <Button size="sm" variant="ghost" className="py-[3px]" onClick={() => setShowAll(true)}>
          +{hiddenCount} more
        </Button>
      )}
    </Stack>
  )
}
