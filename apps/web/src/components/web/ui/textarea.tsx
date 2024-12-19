import type { ComponentProps } from "react"
import { Box } from "~/components/common/box"
import { inputVariants } from "~/components/web/ui/input"
import { type VariantProps, cx } from "~/utils/cva"

export type TextAreaProps = Omit<ComponentProps<"textarea">, "size"> &
  VariantProps<typeof inputVariants>

export const TextArea = ({ className, size, ...props }: TextAreaProps) => {
  return (
    <Box focus>
      <textarea
        className={cx(
          "leading-normal! resize-none field-sizing-content",
          inputVariants({ size, className }),
        )}
        {...props}
      />
    </Box>
  )
}
