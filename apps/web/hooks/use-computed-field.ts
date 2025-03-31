import { useEffect } from "react"
import type { FieldPath, FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form"

type UseComputedFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  sourceField: FieldPath<T>
  computedField: FieldPath<T>
  enabled?: boolean
  callback: (value: string) => string
}

export const useComputedField = <T extends FieldValues>({
  form,
  sourceField,
  computedField,
  enabled = true,
  callback,
}: UseComputedFieldProps<T>) => {
  const source = form.watch(sourceField)
  const state = form.getFieldState(computedField)

  useEffect(() => {
    if (enabled && !state.isTouched) {
      form.setValue(computedField, callback(source) as PathValue<T, Path<T>>, {
        shouldValidate: form.formState.isSubmitted,
        shouldDirty: form.formState.isDirty,
      })
    }
  }, [source, enabled])
}
