import type { ComponentProps } from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

const gridVariants = cva({
  base: "w-full grid place-content-start gap-5",

  variants: {
    size: {
      "2xs": "grid-cols-2xs",
      xs: "grid-cols-xs",
      sm: "grid-cols-sm",
      md: "grid-cols-md",
      lg: "grid-cols-lg",
      xl: "grid-cols-xl",
    },
  },

  defaultVariants: {
    size: "lg",
  },
})

type GridProps = Omit<ComponentProps<"div">, "size"> & VariantProps<typeof gridVariants>

export const Grid = ({ className, size, ...props }: GridProps) => {
  return <div className={cx(gridVariants({ size, className }))} {...props} />
}
