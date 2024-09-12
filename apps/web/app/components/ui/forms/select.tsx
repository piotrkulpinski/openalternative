import { type SelectHTMLAttributes, forwardRef } from "react"
import { inputVariants } from "~/components/ui/forms/input"
import { type VariantProps, cx } from "~/utils/cva"

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  VariantProps<typeof inputVariants>

export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const { className, ...rest } = props

  return (
    <select ref={ref} className={cx(inputVariants({ hoverable: true, className }))} {...rest} />
  )
})

Select.displayName = "Input"
