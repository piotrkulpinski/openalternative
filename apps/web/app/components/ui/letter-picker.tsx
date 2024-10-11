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
            "px-2 py-1 text-sm font-medium text-center rounded uppercase md:flex-1",
            pathname === `${path}/${letter}`
              ? "bg-primary text-background"
              : "bg-card-dark text-muted hover:bg-border",
          )}
          unstable_viewTransition
        >
          {letter}
        </Link>
      ))}
    </div>
  )
}
