import { MoveLeftIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { PaginationLink } from "./PaginationLink"

export const BackButton = ({ ...props }: ComponentProps<typeof PaginationLink>) => {
  return (
    <PaginationLink className="self-start" prefix={<MoveLeftIcon />} {...props}>
      back
    </PaginationLink>
  )
}
