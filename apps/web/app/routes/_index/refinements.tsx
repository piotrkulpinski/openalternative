import type { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { RangeSlider } from "./range-slider"
import { RefinementList } from "./refinement-list"

export const Refinements = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={cx(
        "grid grid-auto-fill-xs justify-between gap-6 w-full py-4 px-6 border rounded-lg",
        className,
      )}
      {...props}
    >
      <RefinementList attribute="categories" showMoreLimit={256} showMore />
      <RefinementList attribute="alternatives" showMoreLimit={256} showMore />
      <RefinementList attribute="languages" showMoreLimit={256} showMore />
      <RefinementList attribute="topics" showMoreLimit={512} showMore />

      <RangeSlider attribute="stars" />
      <RangeSlider attribute="forks" />
    </div>
  )
}
