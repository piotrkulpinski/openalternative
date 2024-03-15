import { Button } from "@curiousleaf/design"
import Link from "next/link"
import { Intro } from "~/components/Intro"

export const runtime = "edge"

export default function NotFound() {
  const title = "Page not found"

  return (
    <Intro title={title} description="The page you are looking for does not exist.">
      <Button theme="secondary">
        <Link href="/">Go back to the home page</Link>
      </Button>
    </Intro>
  )
}
