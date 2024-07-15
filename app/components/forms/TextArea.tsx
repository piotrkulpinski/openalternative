import { ComponentPropsWithoutRef, type TextareaHTMLAttributes, forwardRef } from "react"
import { cx } from "~/utils/cva"
import { Input, inputVariants } from "~/components/forms/Input"

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  ComponentPropsWithoutRef<typeof Input>

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const { className, size, ...rest } = props

  return (
    <textarea
      ref={ref}
      className={cx("!leading-normal", inputVariants({ size, className }))}
      {...rest}
    />
  )
})

TextArea.displayName = "TextArea"
