import { InputHTMLAttributes, forwardRef } from "react"
import { VariantProps, cva, cx } from "~/utils/cva"

export const inputVariants = cva({
  base: "rounded-md border appearance-none bg-transparent px-3 py-2 text-[13px]/tight text-neutral-600 font-medium placeholder:text-inherit placeholder:opacity-50 disabled:opacity-50 dark:text-neutral-400 dark:bg-neutral-800/40 dark:border-neutral-700",

  variants: {
    hoverable: {
      true: "enabled:cursor-pointer enabled:hover:bg-neutral-100 enabled:hover:border-neutral-300 enabled:dark:hover:bg-neutral-800 enabled:dark:hover:border-neutral-600",
    },
  },
})

export type InputProps = InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, hoverable, ...rest } = props

  return <input ref={ref} className={cx(inputVariants({ hoverable, className }))} {...rest} />
})

Input.displayName = "Input"
