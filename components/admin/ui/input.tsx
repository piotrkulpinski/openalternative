import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

const Input = ({ className, type, ...props }: ComponentProps<"input">) => {
  return (
    <input
      type={type}
      className={cx(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
