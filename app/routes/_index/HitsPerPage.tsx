import { useHitsPerPage, type UseHitsPerPageProps } from "react-instantsearch"
import { Select } from "~/components/forms/Select"

export const HitsPerPage = ({ ...props }: UseHitsPerPageProps) => {
  const { items, refine } = useHitsPerPage(props)
  const { value: currentValue } = items.find(({ isRefined }) => isRefined) || {}

  return (
    <Select
      onChange={(e) => {
        refine(Number(e.target.value))
      }}
      value={String(currentValue)}
    >
      <option value="" disabled>
        Hits per page
      </option>

      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </Select>
  )
}
