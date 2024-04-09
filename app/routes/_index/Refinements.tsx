import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { RangeSlider } from "./RangeSlider"
import { RefinementList } from "./RefinementList"

export const Refinements = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={cx("grid grid-auto-fill-xs gap-4 w-full py-3 px-4 border rounded-md", className)}
      {...props}
    >
      <RefinementList attribute="categories" showMoreLimit={256} showMore />
      <RefinementList attribute="alternatives" showMoreLimit={256} showMore />
      <RefinementList attribute="languages" showMoreLimit={256} showMore />
      <RefinementList attribute="topics" showMoreLimit={512} showMore />

      <div className="flex-1 basis-1/3">
        <RangeSlider attribute="stars" />
      </div>

      <div className="flex-1 basis-1/3">
        <RangeSlider attribute="forks" />
      </div>
    </div>
  )
}
