import { type ComponentPropsWithoutRef, type TextareaHTMLAttributes, forwardRef } from "react"
import { type Input, inputVariants } from "~/components/forms/Input"
import { cx } from "~/utils/cva"

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
