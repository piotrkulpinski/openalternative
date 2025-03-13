import type { ComponentProps } from "react"
import { Box, type boxVariants } from "~/components/common/box"
import { type VariantProps, cva, cx } from "~/utils/cva"

const inputVariants = cva({
  base: "appearance-none min-h-0 w-full self-stretch bg-background text-secondary-foreground font-medium text-[0.8125rem] leading-tight break-words transition duration-150 disabled:text-secondary-foreground/50",

  variants: {
    size: {
      sm: "px-2 py-1 font-normal rounded-md",
      md: "px-3 py-2 rounded-md",
      lg: "px-4 py-2.5 rounded-lg sm:text-sm",
    },
  },

  defaultVariants: {
    size: "md",
  },
})

type InputProps = Omit<ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> &
  VariantProps<typeof boxVariants>

const Input = ({ className, size, hover = false, focus = true, ...props }: InputProps) => {
  return (
    <Box hover={hover} focus={focus}>
      <input className={cx(inputVariants({ size, className }))} {...props} />
    </Box>
  )
}

export { Input, inputVariants }
