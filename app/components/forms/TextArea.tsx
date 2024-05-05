import { type TextareaHTMLAttributes, forwardRef } from "react"
import { type VariantProps, cx } from "~/utils/cva"
import { inputVariants } from "./Input"

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof inputVariants>

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const { className, ...rest } = props

  return <textarea ref={ref} className={cx(inputVariants({ className }))} {...rest} />
})

TextArea.displayName = "TextArea"
