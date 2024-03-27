import { LabelHTMLAttributes, forwardRef } from "react"
import { VariantProps, cva, cx } from "~/utils/cva"

export const labelVariants = cva({
  base: "block text-sm font-semibold text-neutral-800 [&[for]]:cursor-pointer dark:text-neutral-200",

  variants: {
    isRequired: {
      true: "after:ml-0.5 after:text-red-600 after:content-['*']",
    },
  },
})

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & VariantProps<typeof labelVariants>

export const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  const { className, htmlFor, isRequired, ...rest } = props

  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cx(labelVariants({ isRequired, className }))}
      {...rest}
    />
  )
})

Label.displayName = "Label"
