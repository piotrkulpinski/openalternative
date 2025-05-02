import type { ComponentProps } from "react"
import { Icon } from "~/components/common/icon"
import { PaginationLink } from "~/components/web/pagination-link"

export const BackButton = ({ ...props }: ComponentProps<typeof PaginationLink>) => {
  return (
    <PaginationLink className="self-start" prefix={<Icon name="lucide/arrow-left" />} {...props}>
      back
    </PaginationLink>
  )
}
