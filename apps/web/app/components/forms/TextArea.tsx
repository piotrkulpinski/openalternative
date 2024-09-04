import { type Input, inputVariants } from "apps/web/app/components/forms/Input"
import { cx } from "apps/web/app/utils/cva"
import { type ComponentPropsWithoutRef, type TextareaHTMLAttributes, forwardRef } from "react"

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
