import { SelectHTMLAttributes, forwardRef } from "react"
import { VariantProps, cx } from "~/utils/cva"
import { inputVariants } from "./Input"

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  VariantProps<typeof inputVariants>

export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const { className, ...rest } = props

  return (
    <select
      ref={ref}
      className={cx(inputVariants({ hoverable: true, className }), "py-1.5")}
      {...rest}
    />
  )
})

Select.displayName = "Input"
