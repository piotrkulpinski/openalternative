import { useSearchParams, useNavigate, useLocation } from "@remix-run/react"
import { ChangeEventHandler, HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { H6 } from "./Heading"
import { Select } from "./forms/Select"
import { updateQueryString } from "~/utils/helpers"

export const Filters = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const [params] = useSearchParams()
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  const handleOrderChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.target.value
    const queryString = updateQueryString(search, { order: value })

    navigate(`${pathname}?${queryString}`)
  }

  return (
    <div className={cx("flex items-center gap-2", className)} {...props}>
      <H6>Order by:</H6>
      <Select value={params.get("order") ?? undefined} onChange={handleOrderChange}>
        <option value="score">Default</option>
        <option value="name">Name</option>
        <option value="stars">Stars</option>
        <option value="forks">Forks</option>
      </Select>
    </div>
  )
}
