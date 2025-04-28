import type { ComponentProps } from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

const wrapperVariants = cva({
  base: "@container flex flex-col gap-8 w-full",
  variants: {
    size: {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
    },
  },
})

type WrapperProps = ComponentProps<"div"> & VariantProps<typeof wrapperVariants>

export const Wrapper = ({ className, size, ...props }: WrapperProps) => {
  return <div className={cx(wrapperVariants({ size, className }))} {...props} />
}
