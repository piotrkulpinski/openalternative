import { MoveLeftIcon } from "lucide-react"
import { PaginationLink } from "./PaginationLink"
import { ComponentProps } from "react"

export const BackButton = ({ ...props }: ComponentProps<typeof PaginationLink>) => {
  return (
    <PaginationLink prefix={<MoveLeftIcon />} {...props}>
      back
    </PaginationLink>
  )
}
