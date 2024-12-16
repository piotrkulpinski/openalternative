"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { HTMLAttributes } from "react"
import { config } from "~/config"
import { cx } from "~/utils/cva"

type LetterPickerProps = HTMLAttributes<HTMLDivElement> & {
  path: string
}

export const LetterPicker = ({ path, className, ...props }: LetterPickerProps) => {
  const pathname = usePathname()

  return (
    <div className={cx("flex flex-wrap gap-1 w-full md:justify-between", className)} {...props}>
      {`${config.site.alphabet}&`.split("").map(letter => (
        <Link
          key={letter}
          href={`${path}/${letter}`}
          className={cx(
            "px-2 py-1 text-sm font-medium text-center rounded-sm uppercase md:flex-1",
            pathname === `${path}/${letter}`
              ? "bg-primary text-background"
              : "bg-card-dark text-muted hover:bg-border",
          )}
          prefetch={false}
        >
          {letter}
        </Link>
      ))}
    </div>
  )
}
