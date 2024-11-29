import { isRedirectError } from "next/dist/client/components/redirect"
import { z } from "zod"

export const getErrorMessage = (err: unknown) => {
  const unknownError = "Something went wrong, please try again later."

  if (err instanceof z.ZodError) {
    const errors = err.issues.map(issue => {
      return issue.message
    })

    return errors.join("\n")
  }

  if (err instanceof Error) {
    return err.message
  }

  if (isRedirectError(err)) {
    throw err
  }

  return unknownError
}
