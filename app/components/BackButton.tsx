import { LinkProps } from "@remix-run/react"
import { cx } from "~/utils/cva"
import { NavigationLink } from "./NavigationLink"
import { MoveLeftIcon } from "lucide-react"

export const BackButton = ({ className, ...props }: LinkProps) => {
  return (
    <NavigationLink className={cx("peer mt-auto self-start", className)} end {...props}>
      <MoveLeftIcon className="size-5" /> back
    </NavigationLink>
  )
}
