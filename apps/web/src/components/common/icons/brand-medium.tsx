import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

export const BrandMediumIcon = ({ className, ...props }: ComponentProps<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={256}
      height={256}
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      role="img"
      aria-label="Medium Icon"
      className={cx("brand", className)}
      {...props}
    >
      <ellipse
        cx="72"
        cy="128"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        rx="56"
        ry="60"
      />
      <ellipse
        cx="184"
        cy="128"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        rx="24"
        ry="56"
      />
      <line
        x1="240"
        x2="240"
        y1="72"
        y2="184"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  )
}
