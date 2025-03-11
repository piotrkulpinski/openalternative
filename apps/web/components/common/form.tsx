"use client"

import { Slot } from "radix-ui"
import { type ComponentProps, createContext, use, useId } from "react"
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"
import { Hint } from "~/components/common/hint"
import { Label } from "~/components/common/label"
import { cx } from "~/utils/cva"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = use(FormFieldContext)
  const itemContext = use(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue)

const FormItem = ({ className, ...props }: ComponentProps<"div">) => {
  const id = useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cx("flex flex-col items-start gap-2 w-full", className)} {...props} />
    </FormItemContext.Provider>
  )
}

const FormLabel = (props: ComponentProps<typeof Label>) => {
  const { formItemId } = useFormField()
  return <Label htmlFor={formItemId} {...props} />
}

const FormControl = (props: ComponentProps<typeof Slot.Root>) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot.Root
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  )
}

const FormDescription = ({ className, ...props }: ComponentProps<"p">) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      id={formDescriptionId}
      className={cx("text-[0.8rem] text-foreground/50", className)}
      {...props}
    />
  )
}

const FormMessage = ({ children, ...props }: ComponentProps<typeof Hint>) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <Hint id={formMessageId} {...props}>
      {body}
    </Hint>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
