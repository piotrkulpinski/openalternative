import type { HTMLAttributes } from "react"
import { type UseSortByProps, useSortBy } from "react-instantsearch"
import { Select } from "~/components/forms/Select"

type SortByProps = HTMLAttributes<HTMLElement> & UseSortByProps

export const SortBy = ({ className, ...props }: SortByProps) => {
  const { currentRefinement, options, refine } = useSortBy(props)

  return (
    <Select onChange={e => refine(e.target.value)} value={currentRefinement} className={className}>
      <option value="" disabled>
        Order by
      </option>

      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}
