import type { ComponentProps } from "react"
import { Box } from "~/components/common/box"
import { type VariantProps, cva, cx } from "~/utils/cva"

const inputVariants = cva({
  base: "w-full border appearance-none bg-background text-secondary resize-none [field-sizing:content] font-medium transition duration-150 placeholder:text-inherit placeholder:opacity-50 disabled:opacity-50",

  variants: {
    size: {
      sm: "px-2 py-1 text-[0.8125rem]/none font-normal rounded-md",
      md: "px-3 py-2 text-[0.8125rem]/tight rounded-md",
      lg: "px-4 py-2.5 text-sm/tight rounded-lg",
    },
    hoverable: {
      true: "bg-background enabled:cursor-pointer enabled:hover:bg-card enabled:hover:border-border-dark",
    },
  },

  defaultVariants: {
    size: "md",
  },
})

type InputProps = Omit<ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>

const Input = ({ className, size, hoverable, ...props }: InputProps) => {
  return (
    <Box focus>
      <input className={cx(inputVariants({ size, hoverable, className }))} {...props} />
    </Box>
  )
}

export { Input, inputVariants }
