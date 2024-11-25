import type { ComponentProps } from "react"
import { Box } from "~/components/common/box"
import { type VariantProps, cva, cx } from "~/utils/cva"

const inputVariants = cva({
  base: [
    "appearance-none min-h-0 bg-background text-secondary font-medium break-words truncate transition duration-150 disabled:opacity-50",
    "resize-none field-sizing-content",
  ],

  variants: {
    size: {
      sm: "px-2 py-1 text-[0.8125rem]/none font-normal rounded-md",
      md: "px-3 py-2 text-[0.8125rem]/tight rounded-md",
      lg: "px-4 py-2.5 text-sm/tight rounded-lg",
    },
  },

  defaultVariants: {
    size: "md",
  },
})

type InputProps = Omit<ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>

const Input = ({ className, size, ...props }: InputProps) => {
  return (
    <Box focus>
      <input className={cx(inputVariants({ size, className }))} {...props} />
    </Box>
  )
}

export { Input, inputVariants }
