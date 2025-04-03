"use client"

import { useEffect } from "react"
import { Button } from "~/components/common/button"
import { H3 } from "~/components/common/heading"
import { Note } from "~/components/common/note"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-start gap-2 max-w-lg">
      <H3>Something went wrong!</H3>
      <Note>Please try again. If the problem persists, contact support.</Note>

      <Button className="mt-4" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  )
}
