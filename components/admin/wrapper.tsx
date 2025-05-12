import type { ComponentProps } from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

const wrapperVariants = cva({
  base: "@container flex flex-col gap-8 w-full",
  variants: {
    size: {
      sm: "max-w-(--breakpoint-sm)",
      md: "max-w-(--breakpoint-md)",
      lg: "max-w-(--breakpoint-lg)",
    },
  },
})

type WrapperProps = ComponentProps<"div"> & VariantProps<typeof wrapperVariants>

export const Wrapper = ({ className, size, ...props }: WrapperProps) => {
  return <div className={cx(wrapperVariants({ size, className }))} {...props} />
}
