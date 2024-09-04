import { PaginationLink } from "apps/web/app/components/PaginationLink"
import { MoveLeftIcon } from "lucide-react"
import type { ComponentProps } from "react"

export const BackButton = ({ ...props }: ComponentProps<typeof PaginationLink>) => {
  return (
    <PaginationLink className="self-start" prefix={<MoveLeftIcon />} {...props}>
      back
    </PaginationLink>
  )
}
