import { type SelectHTMLAttributes, forwardRef } from "react"
import { type VariantProps, cx } from "~/utils/cva"
import { inputVariants } from "~/components/forms/Input"

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  VariantProps<typeof inputVariants>

export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const { className, ...rest } = props

  return (
    <select ref={ref} className={cx(inputVariants({ hoverable: true, className }))} {...rest} />
  )
})

Select.displayName = "Input"
