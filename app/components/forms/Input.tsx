import { InputHTMLAttributes, forwardRef } from "react"
import { VariantProps, cva, cx } from "~/utils/cva"

export const inputVariants = cva({
  base: "truncate rounded-md border appearance-none bg-transparent px-3 py-2 text-[13px] font-medium placeholder:text-inherit placeholder:opacity-50 disabled:opacity-50 dark:border-neutral-700",

  variants: {
    hoverable: {
      true: "hover:bg-neutral-50 hover:border-neutral-300 dark:hover:bg-neutral-800 dark:hover:border-neutral-700",
    },
  },
})

export type InputProps = InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, hoverable, ...rest } = props

  return <input ref={ref} className={cx(inputVariants({ hoverable, className }))} {...rest} />
})

Input.displayName = "Input"
