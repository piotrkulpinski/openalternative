import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

export const Hamburger = ({ className, ...props }: ComponentProps<"svg">) => {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-label="Hamburger icon"
      role="img"
      className={cx(
        "duration-300 select-none will-change-transform group-data-[state=open]/menu:rotate-45",
        className,
      )}
      {...props}
    >
      <path
        className="fill-none duration-300 stroke-current stroke-4 [stroke-linecap:round] [stroke-dasharray:40_121] group-data-[state=open]/menu:[stroke-dashoffset:-68px]"
        d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20"
      />
      <path
        className="fill-none duration-300 stroke-current stroke-4 [stroke-linecap:round]"
        d="m 55,50 h -25"
      />
      <path
        className="fill-none duration-300 stroke-current stroke-4 [stroke-linecap:round] [stroke-dasharray:40_121] group-data-[state=open]/menu:[stroke-dashoffset:-68px]"
        d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20"
      />
    </svg>
  )
}
