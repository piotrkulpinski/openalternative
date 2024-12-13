import type { ComponentProps } from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

const gridVariants = cva({
  base: "grid place-content-start gap-5",

  variants: {
    size: {
      sm: "grid-cols-sm",
      md: "grid-cols-md",
      lg: "grid-cols-lg",
    },
  },

  defaultVariants: {
    size: "md",
  },
})

type GridProps = Omit<ComponentProps<"div">, "size"> & VariantProps<typeof gridVariants>

export const Grid = ({ className, size, ...props }: GridProps) => {
  return <div className={cx(gridVariants({ size, className }))} {...props} />
}
