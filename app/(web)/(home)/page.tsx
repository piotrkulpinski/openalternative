import Link from "next/link"
import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { CountBadge, CountBadgeSkeleton } from "~/app/(web)/(home)/count-badge"
import { HomeToolListing } from "~/app/(web)/(home)/listing"
import { Stack } from "~/components/common/stack"
import {
  AlternativePreview,
  AlternativePreviewSkeleton,
} from "~/components/web/alternatives/alternative-preview"
import { NewsletterForm } from "~/components/web/newsletter-form"
import { NewsletterProof } from "~/components/web/newsletter-proof"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Button } from "~/components/web/ui/button"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default function Home({ searchParams }: PageProps) {
  const hideNewsletter = false

  return (
    <>
      <section className="flex flex-col gap-y-6 w-full mb-[2vh]">
        <Intro alignment="center">
          <IntroTitle className="max-w-[45rem] lg:text-5xl!">
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
          <NewsletterForm
            size="lg"
            className="max-w-sm mx-auto items-center text-center"
            buttonProps={{ children: "Join our community", size: "md", variant: "fancy" }}
          >
            <NewsletterProof />
          </NewsletterForm>
        )}
      </section>

      <Suspense fallback={<ToolQuerySkeleton />}>
        <HomeToolListing searchParams={searchParams} />
      </Suspense>

      <Suspense fallback={<AlternativePreviewSkeleton />}>
        <AlternativePreview />
      </Suspense>
    </>
  )
}
