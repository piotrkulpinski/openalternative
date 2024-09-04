import { type VariantProps, cva, cx } from "apps/web/app/utils/cva"
import type { HTMLAttributes } from "react"

const gridVariants = cva({
  base: "grid place-content-start gap-5",

  variants: {
    size: {
      sm: "grid-auto-fill-sm",
      md: "grid-auto-fill-md",
      lg: "grid-auto-fill-lg",
    },
  },

  defaultVariants: {
    size: "md",
  },
})

type GridProps = Omit<HTMLAttributes<HTMLElement>, "size"> & VariantProps<typeof gridVariants>

export const Grid = ({ className, size, ...props }: GridProps) => {
  return <div className={cx(gridVariants({ size, className }))} {...props} />
}
