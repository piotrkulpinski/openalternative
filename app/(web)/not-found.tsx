"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "~/components/web/ui/button"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"

export default function NotFound() {
  const pathname = usePathname()

  return (
    <Intro>
      <IntroTitle>404 Not Found</IntroTitle>

      <IntroDescription className="max-w-xl">
        We're sorry, but the page {pathname} could not be found. You may have mistyped the address
        or the page may have moved.
      </IntroDescription>

      <Button size="lg" className="mt-4" asChild>
        <Link href="/" prefetch={false}>
          Go back home
        </Link>
      </Button>
    </Intro>
  )
}
