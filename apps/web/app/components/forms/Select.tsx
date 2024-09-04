import { inputVariants } from "apps/web/app/components/forms/Input"
import { type VariantProps, cx } from "apps/web/app/utils/cva"
import { type SelectHTMLAttributes, forwardRef } from "react"

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  VariantProps<typeof inputVariants>

export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const { className, ...rest } = props

  return (
    <select ref={ref} className={cx(inputVariants({ hoverable: true, className }))} {...rest} />
  )
})

Select.displayName = "Input"
