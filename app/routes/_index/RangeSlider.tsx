import { useEffect, useState } from "react"
import { useRange, type UseRangeProps } from "react-instantsearch"
import { H6 } from "~/components/Heading"
import { Slider } from "~/components/forms/Slider"

export const RangeSlider = ({ ...props }: UseRangeProps) => {
  const { start, range, canRefine, refine } = useRange(props)
  const { min, max } = range
  const [value, setValue] = useState([min, max])

  const from = Math.max(min, Number.isFinite(start[0]) ? start[0] : min)
  const to = Math.min(max, Number.isFinite(start[1]) ? start[1] : max)

  useEffect(() => {
    setValue([from, to])
  }, [from, to])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <H6 className="truncate capitalize">{props.attribute}</H6>
        <span className="text-xs text-neutral-500">
          {value[0]} - {value[1]}
        </span>
      </div>

      <Slider
        min={min}
        max={max}
        value={value}
        onValueChange={setValue}
        onValueCommit={refine}
        disabled={!canRefine}
        className="my-2 w-full"
      />
    </div>
  )
}
