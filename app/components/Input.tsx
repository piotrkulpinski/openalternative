import { InputHTMLAttributes, forwardRef } from "react"
import { VariantProps, cva, cx } from "~/utils/cva"

export const inputVariants = cva({
  base: "w-full rounded-md border bg-transparent px-3 py-2 text-[13px] font-medium placeholder:text-inherit placeholder:opacity-40 disabled:opacity-50 dark:border-neutral-700",
})

export type InputProps = InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, ...rest } = props

  return <input ref={ref} className={cx(inputVariants({ className }))} {...rest} />
})

Input.displayName = "Input"
