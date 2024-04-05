import { InputHTMLAttributes, forwardRef } from "react"
import { VariantProps, cva, cx } from "~/utils/cva"

export const inputVariants = cva({
  base: "rounded-md border appearance-none bg-transparent px-3 py-2 text-[13px]/tight font-medium placeholder:text-inherit placeholder:opacity-50 disabled:opacity-50 dark:border-neutral-700",

  variants: {
    hoverable: {
      true: "enabled:cursor-pointer enabled:hover:bg-neutral-50 enabled:hover:border-neutral-300 enabled:dark:hover:bg-neutral-800 enabled:dark:hover:border-neutral-700",
    },
  },
})

export type InputProps = InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, hoverable, ...rest } = props

  return <input ref={ref} className={cx(inputVariants({ hoverable, className }))} {...rest} />
})

Input.displayName = "Input"
