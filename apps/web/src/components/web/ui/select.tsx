import type { ComponentProps } from "react"
import { Box } from "~/components/common/box"
import { inputVariants } from "~/components/web/ui/input"
import { type VariantProps, cx } from "~/utils/cva"

export type SelectProps = Omit<ComponentProps<"select">, "size"> &
  VariantProps<typeof inputVariants>

export const Select = ({ className, size, ...props }: SelectProps) => {
  return (
    <Box hover focus>
      <select
        className={cx("field-sizing-content", inputVariants({ size, className }))}
        {...props}
      />
    </Box>
  )
}
