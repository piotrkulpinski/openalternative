"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Button } from "~/components/web/ui/button"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { Prose } from "~/components/web/ui/prose"
import { env } from "~/env"

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
    <Intro>
      <IntroTitle>Something went wrong!</IntroTitle>

      <Prose>
        <p>
          Please try again. If the problem persists, contact support at{" "}
          <Link href={`mailto:${env.NEXT_PUBLIC_SITE_EMAIL}`}>{env.NEXT_PUBLIC_SITE_EMAIL}</Link>.
        </p>
      </Prose>

      <Button className="mt-4" onClick={() => reset()}>
        Try again
      </Button>
    </Intro>
  )
}
