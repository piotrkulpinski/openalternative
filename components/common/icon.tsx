import type { SVGProps } from "react"
import type { IconName } from "~/types/icons"
import { cx } from "~/utils/cva"

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName
}

export const Icon = ({ name, className, ...props }: IconProps) => {
  return (
    <svg
      className={cx("size-[1em]", className)}
      fill="none"
      role="img"
      stroke="currentColor"
      aria-label={`${name} icon`}
      {...props}
    >
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  )
}
