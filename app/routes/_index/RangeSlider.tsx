import type { RangeBoundaries } from "instantsearch.js/es/connectors/range/connectRange"
import { useEffect, useState } from "react"
import { type UseRangeProps, useRange } from "react-instantsearch"
import { H6 } from "~/components/Heading"
import { Slider } from "~/components/forms/Slider"

export const RangeSlider = ({ ...props }: UseRangeProps) => {
  const { start, range, canRefine, refine } = useRange(props)
  const min = range.min || 0
  const max = range.max || 0
  const [value, setValue] = useState([min, max])

  const from = Number.isFinite(start[0]) ? Math.max(min, start[0] as number) : min
  const to = Number.isFinite(start[1]) ? Math.min(max, start[1] as number) : max

  useEffect(() => {
    setValue([from, to])
  }, [from, to])

  const handleValueChange = (value: number[]) => {
    refine(value as RangeBoundaries)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <H6 className="truncate capitalize">{props.attribute}</H6>

        <span className="text-xs text-secondary">
          {value[0]?.toLocaleString()} - {value[1]?.toLocaleString()}
        </span>
      </div>

      <Slider
        min={min}
        max={max}
        value={value}
        onValueChange={setValue}
        onValueCommit={handleValueChange}
        disabled={!canRefine}
        className="my-2 w-full"
      />
    </div>
  )
}
