import Link from "next/link"
import { Suspense } from "react"
import { CountBadge, CountBadgeSkeleton } from "~/app/(web)/(home)/count-badge"
import { Stack } from "~/components/common/stack"
import { Newsletter } from "~/components/web/newsletter"
import { NewsletterProof } from "~/components/web/newsletter-proof"
import { Button } from "~/components/web/ui/button"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"

export default async function Home() {
  const hideNewsletter = false

  return (
    <>
      <section className="flex flex-col gap-y-6 w-full mb-[2vh]">
        <Intro alignment="center">
          <IntroTitle className="max-w-[45rem] lg:!text-5xl">
            Discover {config.site.tagline}
          </IntroTitle>

          <IntroDescription className="lg:mt-2">{config.site.description}</IntroDescription>

          <Suspense fallback={<CountBadgeSkeleton />}>
            <CountBadge />
          </Suspense>
        </Intro>

        {hideNewsletter ? (
          <Stack className="mx-auto place-content-center">
            <Button variant="secondary" asChild>
              <Link href="/alternatives">Browse by Alternatives</Link>
            </Button>

            <Button variant="secondary" asChild>
              <Link href="/submit">Submit a Tool</Link>
            </Button>
          </Stack>
        ) : (
          <Newsletter
            size="lg"
            className="w-full mx-auto items-center text-center"
            buttonProps={{ children: "Join our community", size: "md", variant: "fancy" }}
          >
            <NewsletterProof />
          </Newsletter>
        )}
      </section>
    </>
  )
}
