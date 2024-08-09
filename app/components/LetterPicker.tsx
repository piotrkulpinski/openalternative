import { Link, useLocation } from "@remix-run/react"
import type { HTMLAttributes } from "react"
import { ALPHABET } from "~/utils/constants"
import { cx } from "~/utils/cva"

type LetterPickerProps = HTMLAttributes<HTMLDivElement> & {
  path: string
}

export const LetterPicker = ({ path, className, ...props }: LetterPickerProps) => {
  const { pathname } = useLocation()

  return (
    <div className={cx("flex flex-wrap gap-1 w-full md:justify-between", className)} {...props}>
      {`${ALPHABET}&`.split("").map(letter => (
        <Link
          key={letter}
          to={`${path}/${letter}`}
          className={cx(
            "px-2 py-1 bg-card-dark text-sm font-medium text-muted text-center rounded uppercase md:flex-1 hover:bg-border",
            pathname === `${path}/${letter}` && "bg-primary text-background hover:bg-primary",
          )}
        >
          {letter}
        </Link>
      ))}
    </div>
  )
}
