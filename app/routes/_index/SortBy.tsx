import { useSortBy, type UseSortByProps } from "react-instantsearch-hooks-web"
import { Select } from "~/components/forms/Select"

export const SortBy = ({ ...props }: UseSortByProps) => {
  const { currentRefinement, options, refine } = useSortBy(props)

  return (
    <Select onChange={(event) => refine(event.target.value)} value={currentRefinement}>
      <option value="" disabled>
        Order by
      </option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}
